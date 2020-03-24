from flask import Flask, render_template, request
from flask_cors import CORS

import plotly
import plotly.graph_objs as go
from pymongo import MongoClient
import pandas as pd
import numpy as np
import json

app = Flask(__name__)
CORS(app)

uri = "mongodb://localhost/"
client = MongoClient(uri)


def plot_gps_fix(feature):
    db = client['gps_smooth']
    collection = db['files']
    df = pd.DataFrame(collection.find_one({'_id': feature})['data'])
    data = go.Figure()
    data.add_trace(go.Scattermapbox(lon=df['longitude'], lat=df['latitude'], mode='lines', name='original'))
    data.add_trace(go.Scattermapbox(lon=df['lon_fix'], lat=df['lat_fix'], mode='lines', name='fix'))

    r_lon = max(df['longitude']) - min(df['longitude'])
    c_lon = (max(df['longitude']) + min(df['longitude'])) / 2
    r_lat = max(df['latitude']) - min(df['latitude'])
    c_lat = (max(df['latitude']) + min(df['latitude'])) / 2

    data.update_layout(
        margin = {
            "l": 0,
            "t": 0,
            "b": 0,
            "r": 0,
            "pad": 2
        },
        legend = {
            #"orientation": "h"
        },
        mapbox = {
            'style': "stamen-terrain",
            'zoom': -1.4*np.log(max(r_lon, r_lat)) + 8.683547386731036,
            'center': {
                'lon':c_lon,
                'lat':c_lat
            }
        }
    )

    graphJSON = json.dumps(data, cls=plotly.utils.PlotlyJSONEncoder)
    return graphJSON


def plot_smooth_acc(feature):
    db = client['gps_smooth']
    collection = db['files']
    df = pd.DataFrame(collection.find_one({'_id':feature})['data'])
    data = go.Figure()
    data.add_trace(go.Scatter(x=df.index, y=df['x (m/s2)'], mode='lines', name='original'))
    data.add_trace(go.Scatter(x=df.index, y=df['denoised_x (m/s2)'], mode='lines', name='denoised'))

    graphJSON = json.dumps(data, cls=plotly.utils.PlotlyJSONEncoder)
    return graphJSON

def plot_outlier():
    return create_plot()

def plot_predict():
    db = client['gps_predict']
    collection = db['files']
    df = pd.DataFrame(collection.find_one({'_id': 'file'})['data'])
    data = go.Figure()
    data.add_trace(go.Scattermapbox(lon=df['real_lon'], lat=df['real_lat'], mode='lines', name='original'))
    data.add_trace(go.Scattermapbox(lon=df['pred_lon'], lat=df['pred_lat'], mode='lines', name='prediction'))

    c_lon = (max(df['real_lon']) + min(df['real_lon'])) / 2
    c_lat = (max(df['real_lat']) + min(df['real_lat'])) / 2

    data.update_layout(
        margin={'l': 0, 't': 0, 'b': 0, 'r': 0},
        mapbox={'style': "stamen-terrain", 'zoom': 12.5,
                'center': {'lon': c_lon, 'lat': c_lat}})

    graphJSON = json.dumps(data, cls=plotly.utils.PlotlyJSONEncoder)
    return graphJSON


def create_plot():
    N = 40
    x = np.linspace(0, 1, N)
    y = np.random.randn(N)
    df = pd.DataFrame({'x': x, 'y': y})  # creating a sample dataframe
    data = [
        go.Bar(
            x=df['x'],  # assign x as the dataframe column 'x'
            y=df['y']
        )
    ]

    graphJSON = json.dumps(data, cls=plotly.utils.PlotlyJSONEncoder)
    return graphJSON


@app.route('/plot', methods=['GET', 'POST'])
def getPlot():

    feature = request.args['selected']

    if feature == "gps":
        return plot_gps_fix("file_1")
    if feature == "smooth":
        return plot_smooth_acc("file_1")
    if feature == "outlier":
        return plot_outlier()
    if feature == "predict":
        return plot_predict()

    return create_plot()


if __name__ == '__main__':
    app.run(host = "0.0.0.0")
