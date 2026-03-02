

"""
Custom application exceptions.
"""


class ApplicationError(Exception):
    """Base application exception."""
    pass


class ConfigurationError(ApplicationError):
    """Raised when configuration or system setup fails."""
    pass


class SimulationError(ApplicationError):
    """Raised when simulation process fails."""
    pass


class RepositoryError(ApplicationError):
    """Raised when a repository operation fails."""
    pass