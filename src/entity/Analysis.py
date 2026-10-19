# importar sqlAlchemy? 

class Analysis:
    def __init__(self, id, owner, path, last_static_analysis=None, last_dynamic_analysis=None):
        self.id = id
        self.owner = owner
        self.path = path
        self.last_static_analysis = last_static_analysis
        self.last_dynamic_analysis = last_dynamic_analysis