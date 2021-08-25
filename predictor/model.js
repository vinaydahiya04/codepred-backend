const fetch = require('node-fetch')
var tags = ["dp", "binary search", "graphs", "greedy", "math", "trees", "strings", "brute force", "two pointers"]
var ranks = ["newbie", "pupil", "specialist", "expert", "candidate master", "international master"]
var data;
var profile_dict;
var handle_data;
var ques_solved = {};

function get_features(handle) {
    let r = data['result']

    let tag_dict = {}

    for (tag in tags) {
        ques_solved[tags[tag]] = {}
        tag_dict[tag] = {
            'num': 0,
            'sum': 0
        }
    }



    for (sol in r) {

        if (r[sol]['verdict'] == 'OK') {
            if (!r[sol]['problem']['rating']) continue;
            let rating_val = r[sol]['problem']['rating']
            let valid_tags = r[sol]['problem']['tags']
            let prob_name = r[sol]['problem']['name']




            for (tag in valid_tags) {
                let vt = valid_tags[tag]
                if (!ques_solved[vt]) ques_solved[vt] = {}
                if (ques_solved[vt][rating_val.toString()]) ques_solved[vt][rating_val.toString()].push(prob_name)
                else ques_solved[vt][rating_val.toString()] = [prob_name]
                if (tag_dict[tag]) {
                    tag_dict[tag]['num'] = tag_dict[tag]['num'] + 1
                    tag_dict[tag]['sum'] = tag_dict[tag]['sum'] + rating_val
                }
            }
        }
    }

    for (tag in tag_dict) {
        if (tag_dict[tag]['num'] == 0) continue;
        tag_dict[tag]['sum'] = tag_dict[tag]['sum'] / tag_dict[tag]['num']

    }

    let tag_list = []

    for (tag in tag_dict) {
        if (tag == 'bitmasking') continue;

        x = tag_dict[tag]['sum']

        if (x < 800) x = 800;

        tag_list.push(x);
    }

    return tag_list
}

function check_handle() {


    let r = handle_data;



    let info = []

    if (r['status'] == 'FAILED') return info;

    r = r['result'][0]

    info.push(r['handle'])

    if (r['rank']) info.push(r['rank'])

    if (r['rating']) info.push(r['rating'])

    return info;
}

function similarity(personal_list, rank) {

    let similarity_dict = {}

    for (person in profile_dict[rank]) {
        let sim_score = 0
        let cost = 0
        let self_score = 0

        for (let i = 0; i < 9; i++) {

            sim_score += profile_dict[rank][person][i] * personal_list[i];
            cost += profile_dict[rank][person][i] * profile_dict[rank][person][i]
            self_score += personal_list[i] * personal_list[i]
        }

        let diff = Math.sqrt(self_score) - Math.sqrt(cost)
        diff = Math.abs(diff)
        sim_score /= Math.sqrt(cost);
        sim_score /= diff;


        similarity_dict[person] = sim_score
    }

    let items = Object.keys(similarity_dict).map(function (key) {
        return [key, similarity_dict[key]];
    });

    // Sort the array based on the second element
    items.sort(function (first, second) {
        return second[1] - first[1];
    });





    return items;
    //error prob
}

function predictor(similarity_list, rank) {
    let pred = []

    for (let i = 0; i < 9; i++)pred.push(0);

    let count = 0;

    let sim_sum = 0;





    for (let i = 0; i < similarity_list.length; i++) {


        count++;

        let handle = similarity_list[i][0]

        let n = similarity_list[i][1]

        sim_sum += n

        for (let j = 0; j < 9; j++) {
            let val = profile_dict[rank][handle][j]
            val *= n
            pred[j] += val
        }

        if (count == 10) break;
    }

    for (let i = 0; i < 9; i++) {
        pred[i] /= sim_sum
    }

    return pred;
}


function solver(handle) {


    handle_info = check_handle(handle)




    if (handle_info.length <= 1) return handle_info

    if (handle_info[2] >= 2000) return handle_info

    let score_list = get_features(handle)

    let ind = 0

    for (let i = 0; i < 6; i++) {
        if (ranks[i] == handle_info[1]) {
            ind = i;
            break;
        }
    }

    ind++;

    if (ind == 6) ind = 5;

    target_handle = ranks[ind]



    let sim_list = similarity(score_list, target_handle)

    let pred = predictor(sim_list, target_handle)
    return pred;


}

async function initi(handle) {



    api_link = "https://codeforces.com/api/user.status?handle=" + handle + "&from=1&count=600"

    let prof_link = "https://codeforces.com/api/user.info?handles=" + handle
    let r;

    let pred;

    profile_dict = require('./profile_dict.json')



    await fetch(prof_link).then(res => res.json()).then(res => { handle_data = res })



    await fetch(api_link).then(res => res.json()).then(res => {
        data = res;



        pred = solver(handle);





    }).catch(err => console.log(err))


    return new Promise((resolve, reject) => resolve([pred, ques_solved]))
}

module.exports = initi;