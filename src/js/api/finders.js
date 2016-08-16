

module.exports = function FindersAPI(conn) {
return {
        createItem : function (item, callback){
            conn.query( `INSERT INTO items (categoryId, accountId, title, description, media, createdAt, updatedAt)
                VALUES (?,?,?,?,?,?,?)`, [item.categoryId, item.accountId, item.title, item.description, item.media, new Date(), new Date()],
                function (err, res){
                    if(err){
                        callback(err);
                    }
                    else{
                        callback(null, res);
                    }
                })
        },
        createAccount : function (account, callback) {
               conn.query(`INSERT INTO accounts (name, addressId, media, category_account, createdAt, updatedAt)
                VALUES (?,?,?,?,?,?)`, [account.name, account.addressId, account.media, account.category_account,  new Date(), new Date()], 
                function (err, res) {
                    if(err){
                        console.log(err);
                        callback(err);
                    }
                    else{
                        console.log(res)
                        callback(null, res);
                    }
                })
        },
        createAdmin: function (admin, accountId, callback){
                conn.query(`INSERT INTO admins (firstname, lastname, email, phone, accountId, createdAt, updatedAt)
                VALUES (?,?,?,?,?,?,?)`, [admin.firstname, admin.lastname, admin.email, admin.phone, accountId.id, new Date(), new Date()],  
                function (err, res){
                    if(err){
                        callback(err);
                        console.log(err);
                    }
                    else {
                        callback(null, res);
                    }
                })
        },
        createAddress : function (address, accountId, callback){
            conn.query(`INSERT INTO addresses (street_number, streetline1, streetline2, city, province, country, zip)
                VALUES (?,?,?,?,?,?,?)`, [address.street_number, address.streetline1, address.streetline2, address.city, address.province, address.country, address.zip], 
                function(err, res){
                    if(err){
                        callback(err);
                        console.log(err);
                    }
                    else {
                        callback(null, res);
                    }
                })
        },
        getAllItemsForSearch : function (itemsearch, callback){ //itemsearch must be object with string and accountId properties 
          var itemstring = itemsearch.string;
          var itemaccountid = itemsearch.accountId;
          conn.query( `SELECT * 
                        FROM items 
                        WHERE accountId = ? AND MATCH (title, description)
                        AGAINST (? IN BOOLEAN MODE);`, [itemaccountid, itemstring],
                        function (err, res){
                            console.log(res);
                            if(err){
                                callback(err);
                            }
                            else {
                                callback(null, res);
                            }
                        })  
        },
        getItem : function (item, callback){
            var itemaccountId=  item.accountId;
            var itemtitle =item.title
            conn.query(`
            SELECT * 
            FROM items 
            WHERE accountId = ? AND title = ?`, [itemaccountId, itemtitle], function (err, res){
                if(err){
                    callback(err)
                }
                else {
                    callback(null, res);
                }
            })
        },
        getAllItemsForAccount : function (itemstring, accountId, callback){
            conn.query( `SELECT * FROM items
                            WHERE accountId = ? AND MATCH (title, description)
                            AGAINST (? IN BOOLEAN MODE);`
                        , [accountId, itemstring],
                        function (err, res){
                            if(err){
                                callback(err);
                            }
                            else {
                                callback(null, res);
                            }
                        }) 
        },
        getAddresses : function (accountId, callback) {
            conn.query( `SELECT  * , addresses.id
                                FROM addresses
                                LEFT JOIN accounts
                                ON accounts.addressId = addresses.id
                                WHERE addresses.id = ?;`
                        , [accountId],
                        function (err, res){
                            if(err){
                                callback(err);
                            }
                            else {
                                callback(null, res);
                            }
                        }) 
        }, 
        getAccounts : function (accountname, callback){
            conn.query (`
            SELECT * FROM accounts WHERE name LIKE '%${accountname.account}%'`,
            function (err, res) {
                if(err){
                    callback(err);
                }
                else {
                    callback(null, res);
                }
            })
        },
        deleteItem : function (itemid, callback){
            conn.query(`
            DELETE
            FROM items 
            WHERE id = ?`, [itemid], function (err, res){
                if (err){
                    console.log(err);
                    callback(err);
                }
                else {
                    callback(null, res);
                }
            })
        },
        deleteAdmin : function(adminid, callback){
            conn.query(`
            DELETE
            FROM admins 
            WHERE id = ?`, [adminid], function (err, res){
                if (err){
                    console.log(err);
                    callback(err);
                }
                else {
                    callback(null, res);
                }
            })
        }, 
        editItem : function (itemid, callback) {
            conn.query(`
            DELETE
            FROM admins 
            WHERE id = ?`, [itemid], function (err, res){
                if (err){
                    console.log(err);
                    callback(err);
                }
                else {
                    callback(null, res);
                }
            })
        }
    }
}


