/* API method to get paging information */
// http://www.datatables.net/media/blog/bootstrap/paging.js
$.fn.dataTableExt.oApi.fnPagingInfo = function(oSettings) {
    return {
        "iStart": oSettings._iDisplayStart,
        "iEnd": oSettings.fnDisplayEnd(),
        "iLength": oSettings._iDisplayLength,
        "iTotal": oSettings.fnRecordsTotal(),
        "iFilteredTotal": oSettings.fnRecordsDisplay(),
        "iPage": Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength),
        "iTotalPages": Math.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength)
    };
};

/* Bootstrap style pagination control */
$.extend($.fn.dataTableExt.oPagination, {
    "bootstrap": {
        "fnInit": function(oSettings, nPaging, fnDraw) {
            var oLang = oSettings.oLanguage.oPaginate;
            var fnClickHandler = function(e) {
                e.preventDefault();
                if (oSettings.oApi._fnPageChange(oSettings, e.data.action)) {
                    fnDraw(oSettings);
                }
            };

            $(nPaging).addClass('pagination').append(
                '<ul class="pagination">' +
                '<li class="prev disabled"><a href="#">&larr; ' + oLang.sPrevious + '</a></li>' +
                '<li class="next disabled"><a href="#">' + oLang.sNext + ' &rarr; </a></li>' +
                '</ul>'
            );
            var els = $('a', nPaging);
            $(els[0]).bind('click.DT', {
                action: "previous"
            }, fnClickHandler);
            $(els[1]).bind('click.DT', {
                action: "next"
            }, fnClickHandler);
        },

        "fnUpdate": function(oSettings, fnDraw) {
            var iListLength = 5;
            var oPaging = oSettings.oInstance.fnPagingInfo();
            var an = oSettings.aanFeatures.p;
            var i, j, sClass, iStart, iEnd, iHalf = Math.floor(iListLength / 2);

            if (oPaging.iTotalPages < iListLength) {
                iStart = 1;
                iEnd = oPaging.iTotalPages;
            } else if (oPaging.iPage <= iHalf) {
                iStart = 1;
                iEnd = iListLength;
            } else if (oPaging.iPage >= (oPaging.iTotalPages - iHalf)) {
                iStart = oPaging.iTotalPages - iListLength + 1;
                iEnd = oPaging.iTotalPages;
            } else {
                iStart = oPaging.iPage - iHalf + 1;
                iEnd = iStart + iListLength - 1;
            }

            function clickCallback(e) {
                e.preventDefault();
                oSettings._iDisplayStart = (parseInt($('a', this).text(), 10) - 1) * oPaging.iLength;
                fnDraw(oSettings);
            }

            for (i = 0, iLen = an.length; i < iLen; i++) {
                // Remove the middle elements
                $('li:gt(0)', an[i]).filter(':not(:last)').remove();

                // Add the new list items and their event handlers
                for (j = iStart; j <= iEnd; j++) {
                    sClass = (j == oPaging.iPage + 1) ? 'class="active"' : '';
                    $('<li ' + sClass + '><a href="#">' + j + '</a></li>')
                        .insertBefore($('li:last', an[i])[0])
                        .bind('click', clickCallback);
                }

                // Add / remove disabled classes from the static elements
                if (oPaging.iPage === 0) {
                    $('li:first', an[i]).addClass('disabled');
                } else {
                    $('li:first', an[i]).removeClass('disabled');
                }

                if (oPaging.iPage === oPaging.iTotalPages - 1 || oPaging.iTotalPages === 0) {
                    $('li:last', an[i]).addClass('disabled');
                } else {
                    $('li:last', an[i]).removeClass('disabled');
                }
            }
        }
    }
});

/* Bootstrap style form-control */
$.extend($.fn.dataTableExt.oStdClasses, {
    "sWrapper": "dataTables_wrapper form-inline",
    "sFilterInput": "form-control input-sm",
    "sLengthSelect": "form-control input-sm"
});

// Add links for offsite searching
function addSearchTSV() {
    $('table tr td.empresa').each(function() {
        var empresa = this.innerHTML;
        var empresaURI = encodeURI(empresa);
        var re = /class="search"/;
        var match = re.exec(empresa);
        if (!match) {
            $(this).append('<span class="search">&nbsp;<a target="_blank" title="Búsqueda de esta empresa el la sitio de Tribunal Supremo de Justicia" href="https://encrypted.google.com/search?q=site%3Ahttp%3A%2F%2Fwww.tsj.gov.ve%20' + empresaURI + '">TSV</a>');
        }
    });
}

function addSearchRNC() {
    $('table tr td.rif').each(function() {
        var rifOrig = this.innerHTML;
        var re = /(\w+)-(\d+)/;
        var rif = rifOrig.replace(re, "$1$2");
        var regex = /class="search"/;
        var match = regex.exec(rifOrig);
        if (!match) {
            $(this).append('<span class="search">&nbsp;<a target="_blank" title="Búsqueda de esta empresa con el Sistema RNC en Linea" href="http://rncenlinea.snc.gob.ve/reportes/resultado_busqueda?p=1&rif=' + rif + '&search=RIF">RNC</a></span>');
        }
    });
}

// Initialize a dataTable and load the data via AJAX
function addTable(table, data) {
    if (!$.fn.dataTable.isDataTable('table#' + table)) {
        $('table#' + table).dataTable({
            "aLengthMenu": [20, 50, 100, 200],
            "sDom": "<'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-6'i><'col-md-6'p>>",
            "aoColumnDefs": [{
                "sClass": "empresa",
                "aTargets": [0]
            }, {
                "sClass": "rif",
                "aTargets": [1]
            }],
            "fnDrawCallback": function(oSettings) {
                addSearchTSV();
                addSearchRNC();
            },
            "sPaginationType": "bootstrap",
            "bProcessing": true,
            "sAjaxSource": 'data/' + data,
            "oLanguage": {
                "sLoadingRecords": "Espera...!",
                "sProcessing": "<div class='timer'></div><br />Cargando datos ...",
                "sSearch": "Buscar: ",
                "sZeroRecords": "Nada!",
                "sLengthMenu": "Mostrar _MENU_ por página",
                "sInfo": "Mostrando _START_ a _END_ de _TOTAL_ filas",
                "sInfoEmpty": "",
                "sInfoFiltered": "",
                "oPaginate": {
                    "sFirst": "Primero",
                    "sPrevious": "Anterior",
                    "sNext": "Próximo",
                    "sLast": "Final"
                }
            }
        });
    }
}

// Connect the tabs to the data
$(document).ready(function() {
    $('.nav-tabs li').click(function() {
        var dataSource = $(this).attr('data-source');
        var tableSource = $(this).attr('data-table');
        var table = $('table#' + tableSource);
        if ($(table).is(":hidden") === true) {
            table.show();
        }
        addTable(tableSource, dataSource);
    });
    $('.nav-tabs li.empresas_totals').click();
});
