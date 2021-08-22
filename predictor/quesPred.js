var tags = ["dp", "binary search", "graphs", "greedy", "math", "trees", "strings", "brute force", "two pointers"]

function quesPred(pred, solved_dict) {





    const ques_data = require('./question_data.json')

    for (let i = 0; i < pred.length; i++) {
        if (pred[i] % 100 >= 50) {
            pred[i] += 100 - pred[i] % 100;
        }

        else pred[i] -= pred[i] % 100;

        pred[i] = pred[i].toString()
    }

    //console.log(pred)

    data_list = [];

    for (let i = 0; i < pred.length; i++) {
        let di = []

        let tag = tags[i];

        //console.log(ques_data[tag])



        for (let j = 0; j < ques_data[tag][pred[i]].length; j++) {

            let cp = ques_data[tag][pred[i]][j];

            if (!solved_dict[tag][pred[i]]) di.push(cp)
            else if (!solved_dict[tag][pred[i]].includes(cp)) di.push(cp)





        }

        data_list.push(di);
    }



    return data_list;


}

module.exports = quesPred