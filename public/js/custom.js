var ajax_link = '/ajax'

$(document).ready(function () {
    //Page Name
    $('#pageName').html($('.indexContent').data('page_name'))

    //Left Menu
    //$('.row-menu ul li a').removeClass('active');
    $('.row-menu ul li').removeClass('active')
    //$('.row-menu ul li a[data-name="' + $('.indexContent').data('page_name') + '"]').addClass('active');
    $(
        '.row-menu ul li[data-name="' +
            $('.indexContent').data('page_name') +
            '"]'
    ).addClass('active')

    /* DASHBOARD */
    $('.checklist-item input').click(function () {
        if ($(this).prop('checked')) {
            var value = 1
        } else {
            var value = 0
        }

        var parameters = {
            action: 'add_check',
            id_user: $('#inputId').val(),
            step: $(this).data('id'),
            value: value
        }

        $.getJSON(ajax_link, parameters, function (data) {})
    })

    /* SEARCH PAGE */
    $('.btn_import_list').click(function () {
        var parameters = {
            action: 'add_import_list',
            id_product: $(this).data('id')
        }

        //This option has been disabled
        /*
		if (parseInt($(this).data('stock')) == 0) {
			$('.id_' + $(this).data('id')).find('.lable-out-stock').css('display', 'block');
			return;
		}*/
        $.getJSON(ajax_link, parameters, function (data) {
            //$('.id_' + JSON.parse(data)).hide();
            $('.id_' + JSON.parse(data) + ' button.add').hide()
            $('.id_' + JSON.parse(data) + ' button.edit').show()
        })
    })

    /* PRODUCT DETAIL */
    $('.imgThumb').click(function () {
        $('.detailImage img').attr('src', $(this).data('img'))
    })

    $('.btn_import_list_detail').click(function () {
        var parameters = {
            action: 'add_import_list',
            id_product: $(this).data('id')
        }
        let id = $(this).data('id')
        $.getJSON(ajax_link, parameters, function (data) {
            //window.location.href = $('.pBack').data('url');
            $('.add-to-import-list-' + id).hide()
            $('.edit-on-import-list-' + id).show()
        })
    })

    /* IMPORT LIST */
    $('.import-tab').click(function () {
        var id_product = $(this)
            .parent()
            .parent()
            .data('id')
        var tabName = $(this).data('name')
        $('#product' + id_product)
            .find('.import-tab')
            .removeClass('active')
        $('#product' + id_product)
            .find('.import-tab label')
            .css('color', '#000000')
        $('#product' + id_product)
            .find('.import-content')
            .hide()
        $(this).addClass('active')
        $(this)
            .find('label')
            .css('color', '#89B73D')
        $('#product' + id_product)
            .find('.import-' + tabName)
            .show()
    })

    $('.btn-import-list-delete').click(function () {
        if (
            confirm(
                'Deleting the product will remove it from your Shopify store. Do you really want to delete it?'
            )
        ) {
            var parameters = {
                action: 'delete_import_list',
                id_import_list: [$(this).data('id')]
            }
            $(`#delete-${$(this).data('id')}`).hide();
            $(`#deleting-${$(this).data('id')}`).show();
            $.getJSON(ajax_link, parameters, function (data) {
                location.reload()
            }).fail(function (data) {
                console.log('error1', data.status)
                if (data.status == 403) $('#upgrade-plans-modal').modal('show')
                //$("#upgrade-plans-modal").appendTo("body");
            })
        }
    })

    $('.btn-import-list-delete-all').click(function () {
        var product_ids = [];
        $("input.checkbox:checked").each(function(index, ele) {
            let product_id = $(ele).attr('id').split('-')[1];
            product_ids.push(product_id);
        });
        if(product_ids.length){
            if (
                confirm(
                    'Deleting the products will remove it from your Shopify store. Do you really want to delete it?'
                )
            ) {
                var parameters = {
                    action: 'delete_import_list',
                    id_import_list: product_ids
                }
                product_ids.forEach(product_id => {
                    $(`#delete-${product_id}`).hide();
                    $(`#deleting-${product_id}`).show();
                });
                $.getJSON(ajax_link, parameters, function (data) {
                    location.reload()
                }).fail(function (data) {
                    console.log('error1', data.status)
                    if (data.status == 403) $('#upgrade-plans-modal').modal('show')
                    //$("#upgrade-plans-modal").appendTo("body");
                })
            }
        }
        else{
            alert('At least one checkbox must be selected');
        }
    })

    $('.box-profit').change(function () {
        var id_product = $(this).data('id')
        var cost = $('#cost' + id_product).val()
        var profit = $(this).val()
        if (profit != 0)
            //var value = parseFloat(cost * ( 1 + (profit/100))).toFixed(2);
            var value = parseFloat((100 * cost) / (100 - profit)).toFixed(2)
        else value = cost

        $('#price' + id_product).val(value)
        $('#price' + id_product).data('price', value)
    })

    $('.box-price').change(function () {
        var id_product = $(this).data('id')
        var cost = $('#cost' + id_product).val()
        var precio = $(this).val()
        var value = 0
        if (precio != 0)
            value = parseFloat(((precio - cost) / precio) * 100).toFixed(2)

        $('#profit' + id_product).val(value)
        $('#profit' + id_product).data('profit', value)
    })

    /* MY PRODUCTS */
    $('.mp-table-view button').click(function () {
        var id_product = $(this).data('id')
        $('.mp-product-detail').hide()
        $('.row' + id_product)
            .find('.mp-product-detail')
            .show()
    })

    $('button.orders-customers').click(function () {
        window.location.href =
            '/admin/orders?merchant=' +
            encodeURIComponent($(this).data('merchant'))
    })
    $('button.detail-merchants').click(function () {
        window.location.href =
            '/admin/merchants/show/' + $(this).data('merchantid')
    })

    $('input.change-status').click(function () {
        let status = $(this).is(':checked') ? 1 : 0
        let result = confirm(
            'Are you sure you want to ' +
                (status == 1 ? 'enable' : 'disable') +
                ' this merchant?'
        )
        if (!result) result
        window.location.href =
            '/admin/merchants/changeStatus/' +
            $(this).data('merchantid') +
            '/' +
            status
    })

    /* PLANS */
    /*
	$('#btnSubmitToken').click(function () {
		$.post('{{url("/plans/save-token")}', {
			"_token": "{{ csrf_token()}",
			"token": $('#txtToken').val()
		}, function (data, status) {
			//$('.token-error').hide();
			//$('.token-success').show();
			window.location.href = "{{url('/plans')}"
		}).fail(function (data) {
			$('.token-error').show();
			//$('.token-success').hide();
		});
	});

	$('.update').click(function () {
		$.post('{{url("/plans/update")}', {
			"_token": "{{ csrf_token()}",
			'plan': $(this).data('plan')
		}, function (data, status) {
			$('.token-error').hide();
			window.location.href = "{{url('/plans')}?update=true";
		}).fail(function (data) {
			$('.token-error').show();
		});
	});
	$("div.alert button.close").click(function () {
		window.location.href = "{{url('/plans')}"
	});*/

    $('.buttonDisabled').mouseover(function () {
        $('.answerBD' + $(this).data('id')).show()
    })

    $('.buttonDisabled').mouseout(function () {
        $('.answerBD' + $(this).data('id')).hide()
    })

    /* ADMIN ORDER DETAIL */
    $('#btnNotes').click(function () {
        var texto = $('textarea.ta' + $(this).data('id')).val()
        var parameters = {
            action: 'update_notes',
            id_order: $(this).data('id'),
            notes: ' ' + texto + '. '
        }

        $.getJSON(ajax_link, parameters, function (data) {
            alert('The notes have been updated successfully')
            location.reload()
        })
    })

    /* ADMIN USERS */
    $('#btn-save-user').click(function () {
        //validation
        if (
            $('#txt-user-name').val().length > 2 &&
            $('#txt-email').val().length > 2 &&
            $('#txt-password').val().length > 2 &&
            $('#txt-password').val() == $('#txt-repeat-password').val()
        ) {
            var parameters = {
                action: 'save-user',
                user: $('#txt-user-name').val(),
                email: $('#txt-email').val(),
                password: $('#txt-password').val()
            }

            $.getJSON(ajax_link, parameters, function (data) {
                alert('The user was created successfully')
                location.reload()
            })
        } else {
            alert('You should fill all the fields.')
        }
    })
    var action = '';
    if(window.location.pathname == '/my-products'){
        action = 'my-products';
    }
    if(window.location.pathname == '/import-list'){
        action = 'delete-import-list';
    }
    $('#page_size').change(function (event) {
        var parameters = {
            action: action,
            page_size: event.target.value,
            page_number: 1
        }
        $.getJSON(ajax_link, parameters, function (res) {
            pagination(res);
            if(res.improds){
                console.log(res);
                showImportProducts(res.improds);
            }
            else{
                showMyProducts(res);
            }
        })
    })

    $('#next').click(function () {
        var total_count = $('#total_count').text();
        var page_size = $('#page_size').val();
        var page_number = $('#page_number').text();
        var parameters = {
            action: action,
            page_size: page_size,
            page_number: page_number * 1 + 1
        }
        if(total_count > page_size * page_number){
            $.getJSON(ajax_link, parameters, function (res) {
                pagination(res);
                if(res.improds){
                    showImportProducts(res.improds);
                }
                else{
                    showMyProducts(res);
                }
            })
        }
    })

    $('#prev').click(function () {
        var parameters = {
            action: action,
            page_size: $('#page_size').val(),
            page_number: $('#page_number').text() * 1 - 1
        }
        if($('#page_number').text() > 1){
            $.getJSON(ajax_link, parameters, function (res) {
                pagination(res);
                if(res.improds){
                    showImportProducts(res.improds);
                }
                else{
                    showMyProducts(res);
                }
            })
        }
    })

    function pagination (data) {
        if (data.page_number == '1') {
            $('#prev').prop('disabled', true);
        } else {
            $('#prev').prop('disabled', false);
        }
        if (data.page_number * data.page_size >= data.total_count) {
            $('#next').prop('disabled', true);
        } else {
            $('#next').prop('disabled', false);
        }
        $('#total_count').text(data.total_count);
        $('#page_number').text(data.page_number);
    }

    function showMyProducts (data) {
        $('.productdatarow').remove()
        $('.shoproductrow').remove()
        var str = ''
        data.prods.forEach(product => {
            str += `<tr class="productdatarow">
                <td class="check">
                    <input type="checkbox" id="check-${product.id_shopify}" data-id="${product.id_my_products}" value="" class="checkbox">
                </td>
                <td class="pimage">
                    <div class="productphoto">
                        <img src="${product.image_url}">
                    </div>
                </td>
                <td data-label="PRODUCT NAME">
                    ${product.name}
                </td>
                <td data-label="COST GDS">
                    ${Math.round(product.price * 100)/100}
                </td>
                <td data-label="PROFIT">
                    ${product.profit}%
                </td>
                <td data-label="RETAIL PRICE">
                    ${Math.round((100 * product.price) * 100 / (100 - product.profit))/100}
                </td>
                <td data-label="SKU">
                    ${product.sku}
                </td>
                <td>
                    <button class="btn-mp-view viewbutton vplist" data-id="${product.id}" data-view="#product${product.id}">View</button>
                </td>
                <td>
                    <button class="btn-mp-delete deletebutton" id="delete-${product.id_shopify}" data-myproductid="${product.id_shopify}">Delete</button>
                    <button class="deletebutton" id="deleting-${product.id_shopify}" data-myproductid="${product.id_shopify}" style="display: none;">Deleting...</button>
                    <button class="deletebutton" id="deleted-${product.id_shopify}" data-myproductid="${product.id}" style="display: none;">Deleted</button>
                </td>
            </tr>
            <tr class="shoproductrow" id="product${product.id}">
                <td></td>
                <td colspan="8">
                    <div class="productlisthow">
                        <div class="productimage">
                            <img src="${product.image_url}">
                        </div>
                        <div class="productdata">
                            <h3>${product.name}</h3>
                            <p class="price">Price ${Math.round((100 * product.price) /(100 - product.profit))}</p>
                            <p>
                                Stock: ${product.stock}
                            </p>
                            <p>
                                Cost: ${product.price}
                            </p>
                            <p>
                                Profit: ${product.profit}%
                            </p>
                            <p>
                                Brand: ${product.brand}
                            </p>

                            <div class="pbuttons">
                                <button class="edit edit-product" data-shopifyid="${product.id_shopify}">Edit on Shopify</button>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>`
        })
        str += `<script type="text/javascript">
            $(".vplist").click(function(e) {
                e.preventDefault();
                var idp= $(this).attr('data-view');
                if(!$(idp).hasClass("active")){
                    $(".shoproductrow").removeClass("active");
                    $(".productdatarow").removeClass("showp");
                }

                $(idp).toggleClass("active");
                $(this).parents(".productdatarow").toggleClass("showp");
            });
        </script>`
        $('#product_data').html(str);
    }

    function showImportProducts (data) {
        $('.productboxelement').remove();
        var csrf_token = $('meta[name="csrf-token"]').attr('content');
        var str = '';
        data.products.forEach(product => {
            var image_str = '';
            var button_str = '';
            if(data.plan == 'free'){
                button_str += `<button data-toggle="modal" data-target="#upgrade-plans-modal" class='delete id="delete-${product.id_import_list}" data-id="${product.id_import_list}">Delete <img class="button-icon" src="img/delete.png" alt="Trash Can - Delete Icon"></button>
                    <button class='delete' id="deleting-${product.id_import_list}" style="display: none;" data-id="${product.id_import_list}">Deleting... <img class="button-icon" src="img/delete.png" alt="Trash Can - Delete Icon"></button>
                    <button data-toggle="modal" data-target="#upgrade-plans-modal" class='sendto btn-import-list-send btn-import-list-send-${product.id_import_list} verModal' data-id="${product.id_import_list}">Send to Shopify <img class="button-icon" src="img/edit.png" alt="Pencil in Square - Edit Icon"></button>
                    <button class="sendto sending btn-import-list-send3 btn-import-list-send3-${product.id_import_list}" data-shopifyid="0" style="display:none">Sending...</button>
                    <button class="sendto edit-in-shopify btn-import-list-send2 btn-import-list-send2-${product.id_import_list}" data-shopifyid="0" style="display:none">Edit in Shopify Store</button>`;
            }
            else{
                button_str += `<button class='delete btn-import-list-delete' id="delete-${product.id_import_list}" data-id="${product.id_import_list}">Delete <img class="button-icon" src="img/delete.png" alt="Trash Can - Delete Icon"></button>
                    <button class='delete' id="deleting-${product.id_import_list}" style="display: none;" data-id="${product.id_import_list}">Deleting... <img class="button-icon" src="img/delete.png" alt="Trash Can - Delete Icon"></button>
                    <button class='sendto btn-import-list-send btn-import-list-send-${product.id_import_list}' data-id="${product.id_import_list}">Send to Shopify <img class="button-icon" src="img/edit.png" alt="Pencil in Square - Edit Icon"></button>
                    <button class="sendto sending btn-import-list-send3 btn-import-list-send3-${product.id_import_list}" data-shopifyid="0" style="display:none">Sending...</button>
                    <button class="sendto edit-in-shopify btn-import-list-send2 btn-import-list-send2-${product.id_import_list}" data-shopifyid="0" style="display:none">Edit in Shopify Store</button>`;
            }
            product.images.forEach((image, i) => {
                image_str += `<div class="selectimage">
                    <div class="imagewrap">
                        <img class="img${product.id_import_list}-${i}" src="${image}">
                    </div>
                    <div class="checkim">
                        <input type="checkbox" class="chk-img${product.id_import_list}" data-index="${i}" value="" checked="checked">
                    </div>
                </div>`;
            });
            str += `<div class="productboxelement import-product" id='product${product.id_import_list} data-id=' ${product.id_import_list}'>
                <h2>${product.name}</h2>
                <div class="producttabs">
                    <div class="headertabs">
                        <div class="checkt">
                            <input type="checkbox" id="check-${product.id_import_list}" class="checkbox" style="display: block;">
                        </div>
                        <div class="tabs">

                            <a href=".tab-1" class="thetab active"> Product </a>
                            <a href=".tab-2" class="thetab"> Description </a>
                            <a href=".tab-3" class="thetab"> Pricing </a>
                            <a href=".tab-4" class="thetab"> Images </a>

                        </div>
                        <div class="buttons import-actions">
                            ${button_str}
                        </div>
                    </div>
                    <div class="contenttabs">
                        <div class="tab-1 wpadding tabcontent active">
                            <div class="productgrid">
                                <div>
                                    <div class="imagewrap">
                                        <img src='${product.image_url}'>
                                    </div>
                                </div>
                                <div>
                                    <h3>
                                        ${product.name}
                                    </h3>
                                    <div class="editform">
                                        <div class="full">
                                            <label for="">Change product name</label>
                                            <input type="text" id="name${product.id_import_list}" value='${product.name}'>
                                        </div>
                                        <div class="full">
                                            <label for="">Collection <span class="simple-tooltip" title="You can assign the product to a Collection in your Shopify store.">?</span></label>
                                            <input type="text" id="collections${product.id_import_list}">
                                        </div>
                                        <div>
                                            <label for="">Type <span class="simple-tooltip" title="You can give this product a classification that will be saved in the 'Product Type' field in Shopify.">?</span></label>
                                            <input type="text" id="type${product.id_import_list}">
                                        </div>
                                        <div>
                                            <label for="">Tags <span class="simple-tooltip" title="You can create your own tags separated by commas.">?</span></label>
                                            <input type="text" id="tags${product.id_import_list}">
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div class="tab-2 tabcontent wpadding import-content import-description">
                            <textarea class="texteditor editor" name="" id="description${product.id_import_list}" cols="30" rows="10">${product.description}</textarea>
                        </div>
                        <div class="tab-3 tabcontent wpaddingtop">
                            <table class="greentable" cellspacing="0">
                                <thead>
                                    <tr>

                                        <th>
                                            SKU <span class="simple-tooltip" title="Do not change this SKU in your Shopify store.">?</span>
                                        </th>
                                        <th>
                                            HEIGHT
                                        </th>
                                        <th>
                                            WIDTH
                                        </th>
                                        <th>
                                            LENGTH
                                        </th>
                                        <th>
                                            WEIGHT
                                        </th>
                                        <th>
                                            COST
                                        </th>
                                        <th>
                                            PROFIT (%) <span class="simple-tooltip" title="Profit excludes shipping charges.">?</span>
                                        </th>
                                        <th>
                                            PRICE
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>

                                    <tr class="productdatarow">

                                        <td data-label="SKU" class="skutd">
                                            <input type="text" id="sku${product.id_import_list}" data-id="${product.id_import_list}" value="${product.sku}" disabled="disabled">
                                            <input type="hidden" id="upc${product.id_import_list}" value="${product.upc}" />
                                        </td>
                                        <td data-label="HEIGHT">
                                            ${product.ship_height}
                                        </td>
                                        <td data-label="WIDTH">
                                            ${product.ship_width}
                                        </td>
                                        <td data-label="LENGTH">
                                            ${product.ship_length}
                                        </td>
                                        <td data-label="WEIGHT" id="weight${product.id_import_list}">
                                            ${product.weight}
                                        </td>
                                        <td data-label="COST" class="w100">
                                            <div class="costgrid">
                                                <div>
                                                    $
                                                </div>
                                                <input type="text" id="cost${product.id_import_list}" data-id="${product.id_import_list}" value="${Math.round(product.price*100)/100}" disabled="disabled">
                                            </div>

                                        </td>
                                        <td data-label="PROFIT (%) " class="w100">
                                            <span class="simple-tooltip" title="First tooltip">?</span>
                                            <div class="inpupercent">
                                                <input type="text" class="box-profit" id="profit${product.id_import_list}" data-id="${product.id_import_list}" value="${data.profit}">
                                                <div class="percent">
                                                    %
                                                </div>
                                            </div>

                                        </td>
                                        <td data-label="PRICE" class="w100">
                                            <div class="inputprice">
                                                <div class="currency">
                                                    $
                                                </div>
                                                <input type="text" class="box-price" id="price${product.id_import_list}" data-price="${product.price}" data-id="${product.id_import_list}" value="${Math.round(10000*product.price/(100-data.profit))/100}">
                                            </div>

                                        </td>

                                    </tr>


                                </tbody>
                            </table>
                        </div>
                        <div class="tab-4 wpadding tabcontent">
                            <div class="imagesgrid">
                            ${image_str}
                            </div>
                        </div>
                    </div>

                </div>
            </div>`
        })

        str += `<script src="js/ckeditor/ckeditor.js"></script>
        <script type="text/javascript">
            $(".producttabs .thetab").click(function(e) {
                e.preventDefault();
                $(this).parents(".producttabs").find(".thetab").removeClass("active");
                $(this).addClass("active");
                var thetabid = $(this).attr("href");
                $(this).parents(".producttabs").find(".tabcontent").removeClass("active");
                $(this).parents(".producttabs").find(thetabid).addClass("active");

            });
            $('.verModal').click(function(e) {
                e.preventDefault();
                $('#upgrade-plans-modal').modal('show');
            });


            $(".editor").each(function(index, ele) {
                CKEDITOR.replace($(ele).attr('id'), {});
            });


            $(".edit-in-shopify").click(function() {
                window.location.href = $(this).attr('data-url');
            });
            $('.btn-import-list-send').click(function() {

                let productId = $(this).data('id');
                let images = [];
                $("input.chk-img" + productId + ":checked").each(function(index, ele) {
                    images.push($('.img' + productId + '-' + $(ele).attr('data-index')).attr('src'));
                });

                $('.btn-import-list-send-' + productId).hide();
                $('.btn-import-list-send3-' + productId).show();

                let btn = $(this);
                btn.attr('disabled', true);

                let product = {
                    id: productId,
                    name: $('#name' + productId).val(),
                    weight: $('#weight' + productId).text().trim(),
                    price: $('#price' + productId).val(),
                    cost: $('#cost' + productId).val(),
                    description: CKEDITOR.instances['description' + productId].getData(),
                    product_type: $('#type' + productId).val(),
                    tags: $('#tags' + productId).val(),
                    collections: $('#collections' + productId).val(),
                    sku: $('#sku' + productId).val(),
                    upc: $('#upc' + productId).val(),
                    profit: $('#profit' + productId).val(),
                    images: images
                };

                $.post('/publish-product', {
                    "_token": '${csrf_token}',
                    product: product
                }, function(data, status) {

                    btn.attr('disabled', false);
                    $('.alert-publish-single').show();
                    $('.btn-import-list-send3-' + productId).hide();
                    $('.btn-import-list-send2-' + productId).show();
                    $('.btn-import-list-send2-' + productId).attr('data-shopifyid', data.id_shopify);
                }).fail(function(data) {
                    if (data.status == 403)
                        $('#upgrade-plans-modal').modal('show')
                });
            });
            $('.btn-import-list-send2').off('click');
            $('.btn-import-list-send2').click(function(e) {
                e.preventDefault();
                window.open('http://${data.shopify_url}/admin/products/', '_blank');
                return false;
            });
            $('.btn-import-list-delete').click(function () {
                if (
                    confirm(
                        'Deleting the product will remove it from your Shopify store. Do you really want to delete it?'
                    )
                ) {
                    var product_id = $(this).data('id');
                    var parameters = {
                        action: 'delete_import_list',
                        id_import_list: [${product_id}]
                    }
                    $("#delete-${product_id}").hide();
                    $("#deleting-${product_id}").show();
                    $.getJSON(ajax_link, parameters, function (data) {
                        location.reload()
                    }).fail(function (data) {
                        console.log('error1', data.status)
                        if (data.status == 403) $('#upgrade-plans-modal').modal('show')
                    })
                }
            })
        </script>`
        $('#import-products').html(str);
    }

})
