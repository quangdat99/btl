mongoimport --uri="mongodb://localhost:27017/work_management"  --collection=user_group  --file=./user_group.json --type=json --mode=upsert
pause