function saveCategories() {
    $.each($('#catTableBody').children(), function(i, tr) {
        let catId = this.id;
        let input = $('input.cat_name_val', tr);
        let colorInput = $('input.cat_color_val', tr);
        let catName = input.val();

        // DELETE Category
        if($(tr).attr('changed') === 'delete') {
            console.log('Deleting category: ' + catId + ' ' + catName);
            //DELETE old category
            showCatLoad();
            $.ajax({
                url: url + userID + "/categories/" + catId,
                contentType: 'application/json',
                type: "DELETE",
                success: function (res) {
                    console.log('Status 200');
                    console.log(res);
                    showBanner('DELETE category succesful!', 'Deleted category ' + catName, 'success');
                    fetchCategories(function() {
                        fillCatTable();
                        hideCatLoad();
                    });
                },
                error: function (res) {
                    console.log('Error deleting Category: ', res.status + ' ' + res.statusText);
                    console.log('Code: ', res.responseJSON.code, ', Description: ', res.responseJSON.description);
                    showBanner('Error deleting Category: ' + res.status + ' ' + res.statusText,
                        'Code: ' + res.responseJSON.code
                        + ', Description: ' + res.responseJSON.description, 'error');
                }
            });

        }
        else if(catName.length < 3) {
            showBanner('Error creating New Category', 'Name is too short!', 'error');

        //POST New Category
        } else {
            //if its a newly created category
            if (catId.startsWith('newRow')) {
                console.log('Posting category: ', catName);
                showCatLoad();
                $.ajax({
                    url: url + userID + "/categories",
                    contentType: 'application/json',
                    type: "POST",
                    data: JSON.stringify({"name": catName}),
                    success: function (res) {
                        console.log('Status 200');
                        console.log(res);
                        showBanner('POST Category Succesful', 'Posted category ' + res.name, 'success');
                        fetchCategories(function() {
                            fillCatTable();
                            hideCatLoad();
                        });
                    },
                    error: function (res) {
                        console.log('Error posting Event: ', res.status + ' ' + res.statusText);
                        console.log('Code: ', res.responseJSON.code, ', Description: ', res.responseJSON.description);
                        showBanner('Error posting Category: ' + res.status + ' ' + res.statusText,
                            'Code: ' + res.responseJSON.code
                            + ', Description: ' + res.responseJSON.description, 'error');
                    }
                });

            // "PUT" New Category Values - DELETE and REPOST
            } else if(input.attr('changed') === 'true') {    //if its a category that has been edited
                console.log('Deleting and reposting category: ' + catId + ' ' + catName);
                //instead of PUT DELETE old category and POST new one
                showCatLoad();
                $.ajax({
                    url: url + userID + "/categories/" + catId,
                    contentType: 'application/json',
                    type: "DELETE",
                    success: function (res) {
                        console.log('Status 200');
                        console.log(res);
                        showBanner('DELETE category succesful!', 'Deleted category ' + catName, 'success');

                        // then POST as a new category
                        $.ajax({
                            url: url + userID + "/categories",
                            contentType: 'application/json',
                            type: "POST",
                            data: JSON.stringify({"name": catName}),
                            success: function (res) {
                                console.log('Status 200');
                                console.log(res);
                                showBanner('POST category succesful!', 'Posted category ' + catName, 'success');
                                fetchCategories(function() {
                                    fillCatTable();
                                    hideCatLoad();
                                });
                            },
                            error: function (res) {
                                console.log('Error posting Category: ', res.status + ' ' + res.statusText);
                                console.log('Code: ', res.responseJSON.code, ', Description: ', res.responseJSON.description);
                                showBanner('Error posting Category: ' + res.status + ' ' + res.statusText,
                                    'Code: ' + res.responseJSON.code
                                    + ', Description: ' + res.responseJSON.description, 'error');
                            }
                        });
                    },
                    error: function (res) {
                        console.log('Error deleting Category: ', res.status + ' ' + res.statusText);
                        console.log('Code: ', res.responseJSON.code, ', Description: ', res.responseJSON.description);
                        showBanner('Error deleting Category: ' + res.status + ' ' + res.statusText,
                            'Code: ' + res.responseJSON.code
                            + ', Description: ' + res.responseJSON.description, 'error');
                    }
                });

            // RESET Colors in Library and Rerender Events
            } else if(colorInput.attr('changed')) { //if only the color has been changed
                categories.forEach(function(category) {
                    if(category.id == catId) {
                        console.log('Category found: ', category);
                        console.log('Lets update by ', colorInput.val());
                        category.color = colorInput.val();
                        updateCategoryColors(category);
                    }
                })
            }
        }

    });
}