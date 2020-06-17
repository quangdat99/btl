mongoimport --uri="mongodb://localhost:27017/work_management"  --collection=recent  --file=./recent.json --type=json --mode=upsert --drop
pause