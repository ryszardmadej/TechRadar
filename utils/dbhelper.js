/**
 * Helper function to perform base database operations (e.g. query, insert)
 */
var pg = require('pg');

var DBHelper = function () {
};

/**
 * Perform a select query operation
 * @param sql Statement to perform
 * @param parameters Parameters for the query
 * @param done Function to call on success
 * @param error Function to call on error
 */
DBHelper.query = function (sql, parameters, done, error) {
    if (process.env.USE_SSL) {
        pg.defaults.ssl = true;
    }
   
    pg.connect(process.env.DATABASE_URL, function (err, client) {
        var results = [];

        // Handle connection errors
        if (err) {
            client.end();
            error(err);
            return;
        }
        
        var query = client.query(sql, parameters);

        query.on('row', function (row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function () {
            done(results);
            client.end();
        });

    });
}

/**
 * Perform an insert operation on the database
 * @param sql Statement to perform
 * @param parameters Parameters for the query
 * @param done Function to call on exit
 * @param error Error function to call on error
 */
DBHelper.insert = function (sql, parameters, done, error) {
    if (process.env.USE_SSL) {
        pg.defaults.ssl = true;
    }

    pg.connect(process.env.DATABASE_URL, function (err, client) {
        // Handle connection errors
        if (err) {
            error(err);
            client.end();
            return;
        }

        client.query(sql, parameters,
            function (err, result) {
                if (err) {
                    error(err)
                } else {
                    done(result);
                    client.end();
                }
            });
    });
}


module.exports = DBHelper;