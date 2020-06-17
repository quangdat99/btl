mongoimport --uri="mongodb://localhost:27017/work_management"  --collection=group  --file=./group.json --type=json --mode=upsert --drop
pause