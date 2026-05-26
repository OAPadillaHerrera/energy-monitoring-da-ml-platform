

from analytics.metrics.service import (
    get_basic_metrics,
    get_station_metrics,
    get_energy_metrics
)

def get_dashboard_summary():

    basic = get_basic_metrics()

    station = get_station_metrics()

    energy = get_energy_metrics()

    return {

        "total_consumption":
            basic["total_consumption"],

        "average_consumption":
            basic["average_consumption"],

        "peak_demand":
            station["peak_consumption"],

        "load_factor":
            energy["load_factor"],

        "consumption_by_system":
            basic["consumption_by_system"]
    }