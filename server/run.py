from flask import Flask, jsonify

from src import settings
from src import main
from src import error
from src import dao

from logging import getLogger

LOGGER = getLogger(__name__)

app = Flask(__name__)

app.register_blueprint(main.APP)


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


if __name__ == "__main__":
    dao.init()
    if dao.DB_INSTANCE is None:
        LOGGER.error("database not initialized")
    app.run()
