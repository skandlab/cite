from flask import Flask, jsonify

from src import settings
from src import main
from src import error

app = Flask(__name__)

app.register_blueprint(main.app)


@app.errorhandler(Exception)
def GenericExceptionHandler(error):
    return jsonify("Internal Server Error", 500)


@app.errorhandler(error.ValidationError)
def ValidationErrorHandler(error):
    return jsonify(str(error), 400)


@app.errorhandler(404)
def UrlNotFoundHandler(error):
    return jsonify("Url Not Found", 404)


if __name__ == "__main__":
    app.run(debug=True)
