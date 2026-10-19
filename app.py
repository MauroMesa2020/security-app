from flask import Flask, render_template, Blueprint
import os
from src.controller.analysis_controller.analysisController import analysis_bp
from src.controller.db_controller.dbController import db_bp
import atexit
from src.container import close_resources

# Obtenemos la ruta absoluta de la carpeta donde está app.py
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

from flask import send_from_directory



app = Flask(
    __name__,
    # Apunta a python-security/ui-react/dist
    template_folder=os.path.join(BASE_DIR, 'ui-react', 'dist'),
    # Apunta a python-security/ui-react/dist/assets
    static_folder=os.path.join(BASE_DIR, 'ui-react', 'dist', 'assets'),
    static_url_path='/assets'
)

# REGISTRO DE BLUEPRINTS


app.register_blueprint(analysis_bp, url_prefix="/api/analysis")
app.register_blueprint(db_bp, url_prefix="/api/db")

@app.route("/images/<path:filename>")
def serve_images(filename):
    images_dir = os.path.join(
        BASE_DIR, "ui-react", "dist", "images"
    )
    return send_from_directory(images_dir, filename)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    # Si la ruta empieza con 'api/', puedes dejar que Flask la maneje o ignorarla aquí
    if path.startswith("api/"):
        return {"error": "Ruta de API no encontrada"}, 404
        
    return render_template('index.html')

atexit.register(close_resources)

if __name__ == '__main__':
    app.run( host='0.0.0.0',debug=False, use_reloader=False)