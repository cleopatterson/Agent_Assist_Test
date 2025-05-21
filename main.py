from flask import Flask, render_template, request, session, redirect, url_for
import os

app = Flask(__name__, static_folder='.')
app.secret_key = os.urandom(24)

@app.route('/')
def home():
    user_id = request.headers.get('X-Replit-User-Id')
    if not user_id:
        return render_template('login.html')
    return render_template('index.html',
        user_id=user_id,
        user_name=request.headers.get('X-Replit-User-Name'),
        user_roles=request.headers.get('X-Replit-User-Roles')
    )

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)