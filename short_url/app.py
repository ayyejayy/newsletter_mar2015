from flask import Flask, url_for, request, make_response, g, current_app, jsonify, redirect
from hubify import hub
import urllib, json
from dteam import datastores
import pandas.io.sql as sql
from pandas import DataFrame
from datetime import datetime


app = Flask(__name__)
hub.init_app(app)
ds = datastores.bi()

total_dic = {}
# i = 0

# def sql_to_df(query):
# 	try:
# 		conn = ds.bi_engine.connect().connection
# 		df = sql.read_sql(query, conn)
# 		return df
# 	except:
# 		return None
# 	finally:
# 		conn.close()

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


@app.route('/map_long_to_short', methods=['POST'])
def map_long_to_short_function():

	global total_dic
	# global i

	# i += 1
	d = dict(json.loads(request.get_data()))

	h = str(hash(d["long_url"]))

	total_dic[h] = d["long_url"]
	print total_dic

	return jsonify({"short_url":h})
	


@app.route('/src/<short_url>',methods=['GET'])
def static_proxy(short_url):

	global total_dic

	return redirect(total_dic[short_url], code=302)



if __name__ == '__main__':
	app.run(debug = True)