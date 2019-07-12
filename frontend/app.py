from flask import Flask, escape, request

app = Flask(__name__)

@app.route('/')
def main():
    return 'hello world'

@app.route('/extract', methods=['POST'])
def extract():
    if 'file' in request.files:
        file = open('./' + request.files[0], 'r').read().strip().split('\n')
        file = [file[i].strip().split(',') for i in range(len(file))]
        return file

if __name__ == '__main__':
    main()