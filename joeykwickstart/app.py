from flask import Flask, url_for, request, make_response, g, current_app, jsonify
from hubify import hub
import urllib, json
from dteam import datastores
import pandas.io.sql as sql
from pandas import DataFrame
from datetime import datetime


app = Flask(__name__)
hub.init_app(app)
ds = datastores.bi()

df = DataFrame()

def sql_to_df(query):
	try:
		conn = ds.bi_engine.connect().connection
		df = sql.read_sql(query, conn)
		return df
	except:
		return None
	finally:
		conn.close()

@app.route('/api', methods=['GET'])
def home():
	return jsonify({'msg': 'Welcome to the Squarehouse api!'})

@app.before_request
def before_request():
	g.conn = ds.bi_engine.connect().connection

@app.teardown_request
def teardown_request(exception):
	conn = getattr(g, 'conn', None)
	if conn is not None:
		conn.close()

@app.route('/loadDataFrame', methods=['POST'])
def loadDataFrameFunc():

	global df

	user_args = {}
	query = """select date(t.created) as date, count(*) as value
			from bizdw_v6.lifecycle_events_trials t 
			group by date(t.created)
			"""
	
	df = sql.read_sql(query, g.conn, params=user_args)

	return jsonify({"msg":"dataframe loaded."})


@app.route('/chooseSubset', methods=['POST'])
def funnelFunc():

	d = dict(json.loads(request.get_data()))
	startDate = datetime.strptime(d['startDate'], '%Y-%m-%d').date()
	endDate = datetime.strptime(d['endDate'], '%Y-%m-%d').date()

	dateMap = (df['date'] >= startDate) & (df['date'] <= endDate)

	jsonData = json.loads(df[dateMap].to_json(orient='records'))

	return jsonify({"jsonData":jsonData})
	





if __name__ == '__main__':
	app.run(debug = True)