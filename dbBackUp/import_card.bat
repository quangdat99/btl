mongoimport --uri="mongodb://localhost:27017/work_management"  --collection=card  --file=./card.json --type=json --mode=upsert --drop
pause