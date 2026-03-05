

"""
Application Exception Hierarchy

Defines the base exception types used across the application.
These exceptions allow consistent error handling between
application layers (API, services, repositories, and simulation).
"""

class ApplicationError(Exception):

    pass

class ConfigurationError(ApplicationError):
   
    pass

class SimulationError(ApplicationError):
   
    pass

class RepositoryError(ApplicationError):
   
    pass