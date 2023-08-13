const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const path = require('path');
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(express.static(path.join(__dirname, '../client')));
const crypto = require("crypto");

// //MongoDB set up ans start server
// //build url for client
const url = `mongodb+srv://yashwanthkumarms11:WBQsOI0CMrzpUbQl@cluster0.zf3rn5p.mongodb.net/`;
const client = new MongoClient(url, { useUnifiedTopology: true });
let collecttionRisks = null; // initially null

//Insert some data for testing  
const insertStarterDataRisks = async function () {
    return collecttionRisks.insertMany([
        {
            _id: 1, riskname: "Position of oven", risks: ["Sited in traffic routes being knocked over "], probability: "Low", severity: "Low", riskLevel: "Low", precautions: ["oven is sited in an area free of vehicle and pedestrian traffic with access limited to staff that operate the equipment. ", "A suitable barrier is positioned around the oven to keep children and visitors etc away from hot surfaces", "A sheltered position is used to help eliminate wind and other natural elements from blowing across the oven causing food to spill and smoke/embers from blowing into people. ", "Only designated people fuel used to light the oven following manufacturer’s instructions on the packaging. "]
        }, {
            _id: 2, riskname: "Firefighting equipment", risks: ["No provision to fight fire "], probability: "Low", severity: "High", riskLevel: "Low", precautions: ["A fire extinguisher  or bucket of water is available, sited near the oven. "]
        }, {
            _id: 3, riskname: "Equipment", risks: ["Infected cutlery/cooking implementation "], probability: "Low", severity: "Low", riskLevel: "Low", precautions: ["NO glass equipment is used or stored at the PIZZA OVEN service area.", "All implements are thoroughly washed before and after the PIZZA OVEN to ensure the risk of bacterial infection is sufficiently controlled. ", "Only designated people/cooks can use this equipment "]
        }, {
            _id: 4, riskname: "Food Safety", risks: ["Food poisoning"], probability: "Medium", severity: "High", riskLevel: "Medium", precautions: ["Food is thoroughly cooked before being served to people. ", "Only enough food which can be cooked at any one time is taken out of the cool bag or refrigerator.", "Manufacturer’s instructions are always followed when cooking.", "If available, a refrigerator is used to store uncooked food. If not available a cool bag is used with ice to keep the food chilled. "]
        }, {
            _id: 6,
            riskname: "BBQ Equipment Safety",
            risks: ["Gas leak or malfunction of BBQ equipment"],
            probability: "Medium",
            severity: "High",
            riskLevel: "High",
            precautions: [
                "Regularly inspect and maintain BBQ equipment for any signs of damage or gas leaks.",
                "Ensure proper installation of gas cylinders and connections.",
                "Only authorized personnel should handle the BBQ equipment.",
                "Have a fire extinguisher nearby and train staff on its proper use."
            ]
        },
        {
            _id: 7,
            riskname: "Food Allergy Management",
            risks: ["Cross-contamination of allergens in pizza or BBQ food items"],
            probability: "High",
            severity: "Medium",
            riskLevel: "High",
            precautions: [
                "Ask participants for food allergy information in advance and plan the menu accordingly.",
                "Label food items with allergen information.",
                "Use separate utensils and preparation areas for allergen-free dishes.",
                "Educate staff about food allergens and cross-contamination prevention."
            ]
        },
        {
            _id: 8,
            riskname: "Outdoor Cooking Safety",
            risks: ["Burns or injuries from hot surfaces or open flames"],
            probability: "Medium",
            severity: "Medium",
            riskLevel: "Medium",
            precautions: [
                "Provide clear instructions to participants on safe cooking practices.",
                "Set up designated cooking areas away from high-traffic zones.",
                "Use caution signs and barriers to keep children and visitors away from cooking areas.",
                "Have a first aid kit available for any minor injuries."
            ]
        },
        {
            _id: 9,
            riskname: "Weather Contingency",
            risks: ["Unfavorable weather conditions for outdoor event"],
            probability: "Medium",
            severity: "Medium",
            riskLevel: "Medium",
            precautions: [
                "Monitor weather forecasts leading up to the event and have a backup indoor venue if possible.",
                "Provide adequate shelter and tents to protect participants from rain or sun.",
                "Keep walkways and outdoor areas free from water puddles to prevent slips and falls.",
                "Inform participants about the event's rain plan and any changes in schedule."
            ]
        },
        {
            _id: 10,
            riskname: "Fire Safety",
            risks: ["Accidental fire outbreak during cooking or lighting"],
            probability: "Low",
            severity: "High",
            riskLevel: "High",
            precautions: [
                "Have fire extinguishers, fire blankets, and water buckets readily available.",
                "Educate staff and participants about fire safety and the use of fire extinguishers.",
                "Ensure designated areas for cooking or lighting are clear of flammable materials.",
                "Supervise all fire-related activities closely."
            ]
        },
        {
            _id: 11,
            riskname: "Crowd Management",
            risks: ["Overcrowding and difficulty in managing large groups"],
            probability: "High",
            severity: "Medium",
            riskLevel: "High",
            precautions: [
                "Limit the number of attendees to manageable levels.",
                "Assign trained staff to assist with crowd control and provide clear event guidelines.",
                "Have emergency exits and evacuation plans in case of any incidents.",
                "Maintain clear communication channels to relay important information to participants."
            ]
        },
        {
            _id: 12,
            riskname: "Hygiene and Sanitation",
            risks: ["Contamination due to poor hygiene practices"],
            probability: "Medium",
            severity: "Low",
            riskLevel: "Medium",
            precautions: [
                "Provide handwashing stations and hand sanitizers throughout the event area.",
                "Educate participants on proper handwashing techniques and encourage regular hand hygiene.",
                "Regularly clean and sanitize cooking and serving utensils.",
                "Dispose of waste properly and maintain clean event spaces."
            ]
        },
        {
            _id: 13,
            riskname: "Children's Safety",
            risks: ["Potential hazards to children during the event"],
            probability: "High",
            severity: "Medium",
            riskLevel: "High",
            precautions: [
                "Designate child-friendly areas and supervise children's activities.",
                "Remove any potential hazards like sharp objects or hot surfaces from children's reach.",
                "Ensure proper child-to-staff ratios for activities involving children.",
                "Inform parents and guardians about child safety measures in place."
            ]
        },
        {
            _id: 14,
            riskname: "Allergen-Free Food Preparation",
            risks: ["Accidental inclusion of allergens in food items"],
            probability: "Low",
            severity: "Medium",
            riskLevel: "Medium",
            precautions: [
                "Use separate cooking and preparation areas for allergen-free dishes.",
                "Educate kitchen staff about allergen-free food handling procedures.",
                "Label allergen-free dishes clearly and inform attendees about their availability.",
                "Have an allergy alert system in place for participants to identify their dietary needs."
            ]
        },
        {
            _id: 15,
            riskname: "Waste Management",
            risks: ["Improper waste disposal leading to environmental impact"],
            probability: "Medium",
            severity: "Low",
            riskLevel: "Medium",
            precautions: [
                "Provide recycling bins and clearly label waste disposal areas.",
                "Encourage participants to minimize waste by using reusable or biodegradable utensils.",
                "Arrange for waste collection and disposal in an environmentally responsible manner.",
                "Educate participants about the importance of waste management during the event."
            ]
        }
    ])
        .then(res => console.log("data inserted with ID", res.insertedIds))
        .catch(err => {
            console.log("Could not add data ", err.message);
            //For now, ingore duplicate entry errors, otherwise re-throw the error for the next catch
            if (err.name != 'MongoBulkWriteError' || err.code != 11000) throw err;
        })
}

//connect to database
client.connect()
    .then(connection => {
        collecttionRisks = client.db().collection("risks");
        console.log("Risks: Connected to Database Risks");
    })
    .catch(err => {
        console.log(`Error in connecting to Database Risks ${url.replace(/:([^:@]{1,})@/, ':****@')}`, err);
    })
    .then(() => insertStarterDataRisks()) //invoke insert data for loading initial data

//Endpoint to return all risks
router.get("/all", function (request, response) {
    collecttionRisks.find().toArray()
        .then(doc => {
            try {
                if (doc.length > 0) {
                    response.send(doc);
                } else {
                    response.send("No documents");
                }
            } catch (error) {
                console.log(error);
                response.send("error retriving documents");
            }
        }
        )
});

var idCollection = [];

router.post("/addRisk", function (request, respone) {

    var risksArray = request.body.risksArray;
    var isAdmin = request.session.isAdmin;

    if (isAdmin) {
        risksArray.forEach(element => {

            var riskName = element.riskName;
            var risksArray = element.casualties;
            var probability = element.probability;
            var severity = element.severity;
            var riskLevel = element.riskLevel;
            var precautionsArray = element.controlMeasure;

            // generate Random id
            var n = 0;
            do {
                n = crypto.randomInt(0, 100000);
            } while (idCollection.includes(n));

            collecttionRisks.find({ riskname: riskName }).toArray().then(doc => {
                // console.log("doc");
                // console.log(doc);

                if (doc.length == 0) {
                    collecttionRisks.insertOne(
                        {
                            _id: n, riskname: riskName, risks: risksArray, probability: probability, severity: severity, riskLevel: riskLevel, precautions: precautionsArray
                        }).then(res => respone.status(200).json({ message: "success" })).catch(err => { respone.status(400).json({ message: "Error" }); console.log(err) })

                } else {
                    respone.status(400).json({ message: "Document Exists" });
                }
            })
        });
    } else {
        respone.status(400).json({ message: "Unauthorized" });
    }


})

router.post("/editRisk", function (request, respone) {

    var riskName = request.body.riskName;
    var risksArray = request.body.casualties;
    var probability = request.body.probability;
    var severity = request.body.severity;
    var riskLevel = request.body.riskLevel;
    var precautionsArray = request.body.controlMeasure;
    var riskId = request.body.id;
    var isAdmin = request.session.isAdmin;
    // console.log("riskId");
    // console.log(riskId);
    if (isAdmin) {
        collecttionRisks.find({ _id: riskId }).toArray()
            .then(doc => {
                // console.log("doc")
                // console.log(doc)
                if (doc.length != 0) {
                    collecttionRisks.deleteOne({ _id: riskId })
                        .then(res => {
                            console.log("Success");
                            collecttionRisks.insertOne(
                                {
                                    _id: riskId, riskname: riskName, risks: risksArray, probability: probability, severity: severity, riskLevel: riskLevel, precautions: precautionsArray
                                }).then(res => respone.status(200).json({ message: "success" })).catch(err => respone.status(400).json({ message: "Error" }))
                        }).catch(err => console.log("Error"))



                } else {
                    respone.status(400).json({ message: "Error Finding document" })
                }
            })
    }


})

router.delete('/delete/:id', function (request, respone) {
    var riskID = parseInt(request.params.id)

    // console.log(riskID)
    collecttionRisks.find({ _id: riskID }).toArray()
        .then(doc => {
            // console.log("doc")
            // console.log(doc)
            if (doc.length != 0) {
                collecttionRisks.deleteOne({ _id: riskID })
                    .then(res => respone.status(200).json({ message: "success" })).catch(err => respone.status(400).json({ message: "Error" }))
            } else {
                respone.status(400).json({ message: "Error Finding document" })
            }
        })
})

router.get("/:id/:riskName", function (request, response) {
    var id = parseInt(request.params.id);
    var riskName = request.params.riskName;
    collecttionRisks.find({ riskname: riskName }).toArray()
        .then(doc => {
            try {
                if (doc.length > 0) {
                    response.send(doc);
                } else {
                    response.send("No documents");
                }
            } catch (error) {
                console.log(error);
                response.send("error retriving documents");
            }
        }
        )
});

module.exports = router;