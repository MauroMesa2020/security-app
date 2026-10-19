
from uuid import UUID

from flask import Blueprint, current_app, request, jsonify

from src.container import projects_repository

# Mejorar esto para no llamar a repository desde aca. 



from src.container import analysis_service

analysis_bp = Blueprint('analysis', __name__)
# Por ahora, sin Repository.
# Cuando tengas la BD, lo inyectaremos aquí.




@analysis_bp.route('/static-analysis', methods=['POST'])
def static_analysis():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            'status': 'error',
            'message': 'No se recibieron datos JSON válidos'
        }), 400

    if not data.get('id') or not data.get('path'):
        return jsonify({
            'status': 'error',
            'message': 'Se requieren el ID y la ruta del proyecto'
        }), 400

    try:
        result = analysis_service.static_analysis(
            data['id'],
            data['path']
        )

        return jsonify({
            'status': 'success',
            'data': result
        }), 200

    except ValueError as exc:
        return jsonify({
            'status': 'error',
            'message': str(exc)
        }), 400

    except Exception:
        current_app.logger.exception(
            'Error durante el análisis estático'
        )

        return jsonify({
            'status': 'error',
            'message': 'No se pudo completar el análisis'
        }), 500

@analysis_bp.route('/dynamic-analysis', methods=['POST'])
def dynamic_analysis():
    data = request.get_json(silent=True)

    print("entro")

    if not isinstance(data, dict):
        return jsonify({
            'status': 'error',
            'message': 'Se requiere un objeto JSON válido.'
        }), 400

    project_id = data.get('id')
    url = data.get('url')

    if not project_id or not url:
        return jsonify({
            'status': 'error',
            'message': 'Se requieren el ID y la URL del proyecto.'
        }), 400

    try:
        result = analysis_service.dynamic_analysis(
            project_id=project_id,
            url=url
        )

        return jsonify({
            'status': 'success',
            'data': result
        }), 200

    except ValueError as exc:
        return jsonify({
            'status': 'error',
            'message': str(exc)
        }), 400

    except Exception:

        return jsonify({
            'status': 'error',
            'message': 'No se pudo completar el análisis dinámico.'
        }), 500


@analysis_bp.route(
    "/projects/<project_id>/analyses",
    methods=["GET"],
)
def get_project_analyses(project_id):
    try:
        project_id = str(UUID(project_id))

        analyses = projects_repository.get_analyses_by_project(
            project_id
        )

        return jsonify({
            "status": "success",
            "data": analyses,
        }), 200

    except ValueError:
        return jsonify({
            "status": "error",
            "message": "Invalid project ID.",
        }), 400

    except LookupError as exc:
        return jsonify({
            "status": "error",
            "message": str(exc),
        }), 404

    except Exception:
        current_app.logger.exception(
            "Could not retrieve project analyses"
        )
        return jsonify({
            "status": "error",
            "message": "Could not retrieve project analyses.",
        }), 500


@analysis_bp.route(
    "/analyses/<analysis_id>",
    methods=["GET"],
)
def get_analysis_details(analysis_id):
    try:
        analysis_id = str(UUID(analysis_id))

        result = projects_repository.get_analysis_details(
            analysis_id
        )

        return jsonify({
            "status": "success",
            "data": result,
        }), 200

    except ValueError:
        return jsonify({
            "status": "error",
            "message": "Invalid analysis ID.",
        }), 400

    except LookupError as exc:
        return jsonify({
            "status": "error",
            "message": str(exc),
        }), 404

    except Exception:
        current_app.logger.exception(
            "Could not retrieve analysis details"
        )
        return jsonify({
            "status": "error",
            "message": "Could not retrieve analysis details.",
        }), 500