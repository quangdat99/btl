mongoimport --uri="mongodb://localhost:27017/work_management"  --collection=history  --file=./history.json --type=json --mode=upsert --drop
pause