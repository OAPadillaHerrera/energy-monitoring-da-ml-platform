

"""
Main Application Entry Point

Initializes Flask application, registers blueprints,
configures logging, loads environment variables,
and defines global error handlers.
"""

import os
import logging
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS
from api.routes.simulation import simulation_bp
from api.routes.metrics import metrics_bp
from api.routes.anomaly import anomaly_bp
from api.routes.ml import ml_bp
from api.routes.dashboard import dashboard_bp

#from analytics import analytics_bp
#from globalanalytics import totales_bp

from core.exceptions import (
    ApplicationError,
    SimulationError,
    RepositoryError,
    ConfigurationError
)

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s"
)

logger = logging.getLogger(__name__)
logger.info("Energy Monitoring System starting up...")

app = Flask(__name__)
CORS(app)

app.register_blueprint(simulation_bp, url_prefix="/simulation")
app.register_blueprint(metrics_bp, url_prefix="/metrics")
app.register_blueprint(anomaly_bp, url_prefix="/anomaly")
app.register_blueprint(ml_bp, url_prefix="/ml")
app.register_blueprint(dashboard_bp, url_prefix="/dashboard")

#app.register_blueprint(analytics_bp, url_prefix="/api/consumo")
#app.register_blueprint(totales_bp, url_prefix="/api/totales")

@app.route("/")
def index():

    logger.info("Health check accessed.")

    return jsonify({
        "status": "ok",
        "service": "energy-monitoring-system"
    })

@app.errorhandler(SimulationError)
def handle_simulation_error(error):

    logger.warning("Simulation error: %s", error)

    return jsonify({
        "status": "error",
        "type": "simulation_error",
        "message": str(error)
    }), 400

@app.errorhandler(RepositoryError)
def handle_repository_error(error):

    logger.error("Repository error occurred.", exc_info=error)

    return jsonify({
        "status": "error",
        "type": "repository_error",
        "message": "A database error occurred."
    }), 500

@app.errorhandler(ConfigurationError)
def handle_configuration_error(error):

    logger.error("Configuration error occurred.", exc_info=error)

    return jsonify({
        "status": "error",
        "type": "configuration_error",
        "message": str(error)
    }), 500

@app.errorhandler(ApplicationError)
def handle_application_error(error):

    logger.warning("Application error: %s", error)

    return jsonify({
        "status": "error",
        "type": "application_error",
        "message": str(error)
    }), 400

@app.errorhandler(Exception)
def handle_unexpected_error(error):

    logger.critical("Unexpected server error.", exc_info=error)

    return jsonify({
        "status": "error",
        "type": "unexpected_error",
        "message": "Internal server error."
    }), 500

if __name__ == "__main__":

    debug_mode = os.getenv("FLASK_DEBUG", "false").lower() == "true"

    logger.info("Running Flask application.")

    app.run(
        host="0.0.0.0",
        port=5001,
        debug=debug_mode
    )
