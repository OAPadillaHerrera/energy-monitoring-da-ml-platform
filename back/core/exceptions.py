

"""
Custom application exceptions.
"""

class ApplicationError(Exception):

    pass

class ConfigurationError(ApplicationError):

    pass

class SimulationError(ApplicationError):

    pass

class RepositoryError(ApplicationError):

    pass