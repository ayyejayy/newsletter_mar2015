from flask import Flask, url_for, request, make_response, g, current_app, jsonify
from hubify import hub
import urllib, json
from dteam import datastores
import pandas.io.sql as sql


app = Flask(__name__)
hub.init_app(app)
ds = datastores.bi()

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


@app.route('/endpoint', methods=['POST'])
def funnelFunc():

	data = json.loads(request.get_data())
	date = str(data['date'])

	user_args = {'date': date}

	query = """select count(*) as count
			from bizdw_v6.lifecycle_events_trials t 
			where date(t.created)=%(date)s"""
	
	df = sql.read_sql(query, g.conn, params=user_args)

	return jsonify({"result":df.ix[0,'count']})
	





if __name__ == '__main__':
	app.run(debug = True)