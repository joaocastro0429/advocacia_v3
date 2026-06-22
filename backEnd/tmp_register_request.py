import json
from urllib.request import Request, urlopen
from urllib.error import HTTPError

url = 'http://localhost:3333/api/register'
headers = {'Content-Type': 'application/json'}
data = json.dumps({
    'email': 'testuser+1@example.com',
    'password': 'Pass123!',
    'name': 'Test User',
    'oabNumber': '123456',
    'specialty': 'Civil',
}).encode('utf-8')

req = Request(url, data=data, headers=headers, method='POST')
try:
    with urlopen(req) as res:
        print(res.status)
        print(res.read().decode('utf-8'))
except HTTPError as err:
    print('HTTP', err.code)
    print(err.read().decode('utf-8'))
    raise
