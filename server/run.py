from flask import Flask, jsonify

from src import settings
from src import main
from src import error
from src import dao

from logging import getLogger

LOGGER = getLogger(__name__)

app = Flask(__name__)

app.register_blueprint(main.APP)

# for dev environment
# @app.after_request
# def after_request(response):
#     header = response.headers
#     header["Access-Control-Allow-Origin"] = "http://localhost:3000"
#     header["Access-Control-Allow-Methods"] = "GET"
#     return response


@app.errorhandler(Exception)
def GenericExceptionHandler(error):
    LOGGER.error(error)
    return jsonify("Internal Server Error", 500)


@app.errorhandler(error.ValidationError)
def ValidationErrorHandler(error):
    LOGGER.error(error)
    return jsonify(str(error), 400)


@app.errorhandler(404)
def UrlNotFoundHandler(error):
    return jsonify("Url Not Found", 404)


dao.init()
if dao.DB_INSTANCE is None:
    LOGGER.error("database not initialized")

if __name__ == "__main__":
    app.run()
