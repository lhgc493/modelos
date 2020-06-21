class filtros {

    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        var queryObj = {...this.queryString }
        var excluir = ['page', 'limit', 'sort', 'fields'];
        excluir = excluir.forEach(el => delete queryObj[el]);

        var queryString = JSON.stringify(queryObj);

        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);


        this.query = this.query.find(JSON.parse(queryString));
        return this;
    }

    sort() {

        if (this.queryString.sort) {
            var sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('createAt')
        }

        this.query = this.query.sort()
        return this;
    }

    fields() {

        if (this.queryString.fields) {
            var seleccionado = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(seleccionado);
        } else {
            this.query = this.query.select('-__v');
        }


        return this;
    }

    paginacion() {
        var page = this.queryString.page * 1 || 1;
        var limit = this.queryString.limit * 1 || 10;
        var skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }


}

module.exports = filtros;