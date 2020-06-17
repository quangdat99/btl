mongoimport --uri="mongodb://localhost:27017/work_management"  --collection=user_task  --file=./user_task.json --type=json --mode=upsert --drop
pause