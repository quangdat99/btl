mongoimport --uri="mongodb://localhost:27017/work_management"  --collection=user_index  --file=./user_index.json --type=json --mode=upsert
pause