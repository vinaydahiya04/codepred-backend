const initi = require('./../predictor/model')
const quesPred = require('./../predictor/quesPred')

var tags = ["dp", "binary search", "graphs", "greedy", "math", "trees", "strings", "brute force", "two pointers"]
var solved_dict;
const sendPredictions = (req, res) => {
    try {
        

        
        //let handle = req.params.handle
        let handle = req.query.handle
        

        let pred;

        let ques_pred;

        initi(handle).then(r => {
            pred = r[0];

            solved_dict = r[1]

            


            if (r[0].length == 0) {
                

                return res.status(200).json({
                    flag: 1,
                    message: "Invalid Codeforces Handle"
                })
            }
            else if (r[0].length == 1) {
                
                return res.status(200).json({
                    flag: 2,
                    message: "Please Take Part in atleast one rated contest for the predictor to work"
                })
            }
            else if (r[0].length == 3) {
                
                return res.status(200).json({
                    flag: 3,
                    message: "Sorry! But currently this predictor works only for people ranked less than international master, PS at your rank the ai needs your expertise more than you need the ai"
                })
            }

            

            ques_pred = quesPred(pred, solved_dict)


            return res.status(200).json({
                flag: 4,
                message: "Success",
                data: ques_pred
            })










        }).catch(e => console.log(e))




        //quesPred(pres).then(r => { ques_pred = r }).catch(e => console.log(e))




    } catch (error) {
        
        return res.status(404).json({
            flag: 0,
            message: "Internal Server Error"
        })
    }
}


const sendData = (req, res) => {
    try {
        //let handle = req.params.handle
        let handle = req.query.handle
        
        
        let pred;

        let ques_pred;

        initi(handle).then(r => {
            pred = r;
            
            if (r.length == 0) {
                

                return res.status(200).json({
                    flag: 1,
                    message: "Invalid Codeforces Handle"
                })
            }
            else if (r.length == 1) {
                
                return res.status(200).json({
                    flag: 2,
                    message: "Please Take Part in atleast one rated contest for the predictor to work"
                })
            }
            else if (r.length == 3) {
                
                return res.status(200).json({
                    flag: 3,
                    message: "Sorry! But currently this predictor works only for people ranked less than international master, PS at your rank the ai needs your expertise more than you need the ai"
                })
            }

            // ques_pred = quesPred(pred)

            let ques_dict = {};

            for (let i = 0; i < 9; i++) {
                let x = r[0][i];

                if (x % 100 >= 30) {
                    let y = 100 - x % 100;
                    x += y;
                }
                else {
                    x -= x % 100;
                }
                ques_dict[tags[i]] = x;
            }


            return res.status(200).json({
                flag: 4,
                message: "Success",
                data: ques_dict
            })










        }).catch(e => console.log(e))




        //quesPred(pres).then(r => { ques_pred = r }).catch(e => console.log(e))




    } catch (error) {
        
        return res.status(404).json({
            flag: 0,
            message: "Internal Server Error"
        })
    }
}

module.exports = { sendPredictions, sendData }