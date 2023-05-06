# Physical storage and indexes

- Heap file
  - not the heap part of memory
  - not the heap data structure
  - just a semantic unstructured data from a DB
  - Each 8 kb page is a chunk so you don't need to load the entire DB in memory
    to edit a row, just need to move things around in the chunk itself.
- 8kb pages. Caching a page at a time.
- Check out the postgres documentation of the heap table file.
- To delete or modify, find the page and the offset.
- `CHECKPOINT` is a force write to disk
- reading and writing files, `open()`, `write()`
- `file is full` means every existing page has no room to accomodate an existing
  row, so you have to make a new page to add the new row to.
- PG refers to rows via page number and which item on the page it is.
- PG does NOT have the clustered files or sorted files. It stores them in the
  unsorted heap structure.
- In PG, B+ trees are stored as files. Each B+ tree is stored as a 8kb page.
- Single file is split into 8kb pages.
- PG b+ tree leaf nodes store block id and item pointer to heap file.
- B+ tree indexed on name will just have the names in the index.
- Block and page can be used interchangeably?
- Up to 8kb of data in your B+ tree node, that's what determines how many children
  you can have in your node! Since indexes are just stored as pages in files.
- Pointers between each leaf, doubly linked, allows you to do a range query!
- Bottom layer has all of the data of the table. Values in non-leaf nodes are
  just for traversal decisions, not the actual data.
- The leaf nodes have the page number and the item pointer for where in the
  heap, the table data, to find data.
- B tree, NOT B+ tree, has the page number and pointers in non-leaf nodes, but
  it's more complicated in updating the tree. So you could just stop if you
  found your item, even in a non-leaf node.
- Adding indexes slows down writes, because you have to update EVERY index with
  every new row
- Files are made up of 8kb pages.
- Read one page at a time, so you read the B+ meta page, the root, an internal
  page, and the leaf, then the page on the heap of the table file to get to your
  record. 5 I/Os in total, so 5 \* 8kb.
- Could you hash items of the B tree? To save space? But there isn't much
  benefit of the B tree, like range ordering, you would just use a hash table.
  - don't forget collisions in a hash if it were still a B+ tree.
- Size of page correlates probably to size of block on disk?
