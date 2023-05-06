# Joins and Query Optimization

## Index

- When are they used or not used?
- Query plans?
- If theres an index on a movie title, a query looking for a particular title
  will use that index for the query plan.
  - this also includes ranges. Goes to the leaf of the B+ tree and scans left to
    right from there.
    - But! This index scan doesn't always happen, the query plan might be a
      sequential scan. Why?
      - If the query is looking for the first point of the data, like letter
        'A', there's extra overhead of going between the index and the heap
        data table.
      - But the DBMS doesn't just KNOW this, it computes the best plan based
        on a cost estimate it uses (which is based on the metadata).
      - Each leaf has [page, item number]
    - Wide nodes for B+ tree better than a very tall tree because a node fits
      onto a tree. The hardware I/O is the important part here. So, just 1 I/O
      with a ton of information (from the DB page on disk) will be much better
      than many I/Os (like if the B+ tree had many levels, rather than being
      short and wide)
    - When computer interfaces with disk, it will bring in some size entire chunk of
      disk, anyway.
- `EXPLAIN` query
- **Bitmap heap scan**
  - Pass 1: Go through entire index and remember everything we need for each
    page
    - like `page 5: we need items 10,5,3, and 22`.
  - Pass 2: Load the pages you need and grab the items you need
  - Why is it called a bitmap heap scan?
    - Because it uses bitmap under the hood to store the page:item mapping
- Important thing to remember is that multiple query plans are considered and
  one is chosen based on which is calculated to be better.
- Ordering of results from a query depends on which query plan is chosen (if you
  don't choose an orderby)!
- Not just the structure of the query, but the actual values in the query can
  affect the query plan.

## Clustering

- First idea: Can have a "clustered index"
  - Leaf of B+ tree could store the whole row of data, not pointers, just the
    whole row. Postgres doesn't support
    this feature. - We only support 1 clustered index per table - There won't be a heap file in this case, the leaf node is the only source
    of truth for the row in the table with a clustered index.
  - If only need one row and that row is in the index, it might `index scan
only` because all the data you need is in the index
  - Are some indexes compressed?
  - there are some parameters that are set for the query plan optimizer that can
    be tweaked to make the optimizer do what you want it to do. `SET
random_page_cost = 1.0`
- "CLUSTER" command in Postgres. One-time operation to re-order the rows in your
  heap table file.
  - The table won't stay sorted if you add more rows.
  - The ordering is based on your index you specify, and it's "clustered" after
    the operation
  - `CLUSTER`
  - Use for table that doesn't change data frequently and has known query
    patterns so you can make your queries most efficient
  - Can also cluster on the primary key
  - Clustering is done INTENTIONALLY by DB admins in order to achieve updating
    the data on disk. It isn't done automatically.
- Can also show what is in your buffer cache via some PG command.

## Statistics and cost estimation

- `seq_page_cost`, `random_page_cost`
  - settings you can tune
  - tells you what the cost is to grab a page from disk if doing sequential scan
    from disk. Or cost of random I/O.
    - so a mechanical disk random I/O is much slower than an SSD, so you should
      change that setting if you're on an SSD.
  - If you have a really high I/O cost you want to avoid using the index
- `cpu_tuple_cost`, `cpu_index_tuple_cost`
  - Cost to work on a single tuple? Not sure
- Block / page used interchangeably.
- pg_stats
  - `histogram_bounds` column shows ranges of data, how much fraction of the
    table is in between certain rows
    - This is recomputed every time you run `ANALYZE`
    - Make sure `ANALYZE` is being run, it can make your queries faster.
  - percentage of some value in each row
  - `correlation`
    - How ordered is the data on THAT particular column. Like if you clustered
      the data on some column, it would be correlation 1 on that column.
      - When correlation is high, index scan is efficient
- Oracle, unlike Postgres, will do a lot of proprietary stuff for optimizing.
- Need to find a good trade off between choosing a good plan and executing the
  query. Don't want to necessarily choose the BEST plan.

## Query Execution and Join algorithms

- Code or pseudocode it up.
- How to control which query plan gets chosen?
- What determines which query plan is chosen based on the query?
- idempotent??
- Sort iterator stores the sorted rows in memory or on disk.
- `^[` in vim?
- High-level idea of a hash join
  - Build a hash table of one table `{columnValue: row}`, then iterate over the
    second table and check the hash table for the columnValue in the table
