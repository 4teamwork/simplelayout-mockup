define(["simplelayout/Column"], function(Column) {

  "use strict";

  function Layout(columns) {
    if (!(this instanceof Layout)) {
      throw new TypeError("Layout constructor cannot be called as a function.");
    }
    if (!columns) {
      throw new TypeError("Columns are not defined.");
    }

    var template = $.templates("<div class='sl-layout'></div>");

    return {

      committed: false,

      columns: [],

      toolbar: null,

      create: function(id) {
        this.element = $(template.render());
        this.element.data("layoutId", id);
        for (var i = 0; i < columns; i++) {
          var column = new Column(columns);
          this.columns.push(column);
          var columnElement = column.create();
          columnElement.data("columnId", i);
          columnElement.data("layoutId", id);
          this.element.append(columnElement);
        }
        return this.element;
      },

      commit: function() {
        this.committed = true;
      },

      insertBlock: function(columnId, content, type) {
        var column = this.columns[columnId];
        return column.insertBlock(content, type);
      },

      deleteBlock: function(columnId, blockId) {
        var column = this.columns[columnId];
        column.deleteBlock(blockId);
      },

      getBlock: function(columnId, blockId) {
        return this.columns[columnId].getBlock(blockId);
      },

      setBlock: function(columnId, blockId, block) {
        this.columns[columnId].setBlock(blockId, block);
      },

      commitBlocks: function(columnId) {
        this.columns[columnId].commitBlocks();
      },

      attachToolbar: function(toolbar) {
        this.toolbar = toolbar;
        this.element.append(toolbar.element);
      },

      getCommittedBlocks: function() {
        var committedBlocks = [];
        $.each(this.columns, function(i, column) {
          committedBlocks = $.merge(column.getCommittedBlocks(), committedBlocks);
        });
        return committedBlocks;
      },

      getInsertedBlocks: function() {
        var insertedBlocks = [];
        $.each(this.columns, function(i, column) {
          insertedBlocks = $.merge(column.getInsertedBlocks(), insertedBlocks);
        });
        return insertedBlocks;
      },

      hasBlocks: function() {
        var hasBlocks = false;
        $.each(this.columns, function(i, column) {
          if(column.hasBlocks()) {
            hasBlocks = true;
            return false;
          }
        });
        return hasBlocks;
      },

      toJSON: function() {
        return { columns: this.columns };
      }

    };
  }

  return Layout;

});
