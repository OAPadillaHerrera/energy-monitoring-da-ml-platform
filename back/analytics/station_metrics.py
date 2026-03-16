

def total_energy(df):
    return df["consumption_kwh"].sum()

def avg_hourly_consumption(df):

    hourly_totals = df.groupby("timestamp")["consumption_kwh"].sum()

    return hourly_totals.mean()

def peak_demand(df):

    hourly_totals = df.groupby("timestamp")["consumption_kwh"].sum()

    return hourly_totals.max()

def min_demand(df):

    hourly_totals = df.groupby("timestamp")["consumption_kwh"].sum()

    return hourly_totals.min()