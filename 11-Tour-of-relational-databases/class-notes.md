# Tour of Relational Databases

- Trace path that query takes through system
- NoSQL: Dynamo, Mongo, Redis
- `EXPLAIN` keyword
- Lucene index is for full-text search

## Path of query through system

- Go lang application server
- PG database listening on 5432
- `libPQ` is the library that takes the query and transform it into
  communication protocol Postgres accepts
- Use wireshark to see network traffic, add a filter for pgsql
- When sending a query, over the wire:
  - the query is sent via ASCII (like 53 `S`)
  - the length of the query
- Basically it just sends the raw query, not some fancy data structure
- If you send UTF-8, like a 🕶️, it's fine because postgres can accept UTF-8.
- UTF-8 is backwards compatitible with ASCII
- Request sent via TCP

### What happens in the postgres server after it receives the message?

- Parse step:
  - Input: SQL string
  - Output: Query tree, an AST
    - Just like implementing a language. Scanning and parsing to make a tree.
    - Struct with fields that refers to other structs
- Rewriting steps:
  - Syntactic thing just looking at text of query. Not messing with logic.
    String replacement stuff.
  - update query so that instead of using a view, it will refer to underlying
    tables
    - View:
      - you would create a view by selecting some columns from one table and
        joining it with columns from another table
      - Syntactic sugar -> treats complicated join as a table
      - Virtual table, abstracting away underlying tables / joins, etc.
    - underlying Table?
  - Materialized views?
    - what the hell are these?
- Query Optimizer step. (Query planning):
  - Input: Data structure representing the SQL statement, declerative
  - Output: Could be like bytecode, but Postgres doesn't do this.
    - Output is actually procedural plan of how to do the query.
  - Comes up with plans, then chooses the best plan
  - Check out the output of query planner with `EXPLAIN`
    - Shows a `cost` which helps optimizer choose which option to pick.
    - `cost=0.00..11.75`: Time it takes to get row 0, time it takes to get the
      last row
    - cost numbers don't come from the data, but rather metadata about the
      table. DB computes a lot of stats about each table and uses those as a way
      to estimate the cost numbers. Background process that's running.
      `pg_stats`. This is the table the query planner uses to come up with plans
      and pick a plan. Data shows how often certain things occur, etc.
      Statistics get updated when you run `ANALYZE` command.
    - Optimizer doesn't actually read the data
  - sequential scan, just look through every option
  - SQL server can show percentage CPU increase and other data.
  - Adding an ORDERBY will add a sort step.
  - Query plan picture is the blobs and arrows picture from the lecture
  - Turn off auto vacuum if you're really sensitive to latency and you don't
    want background processes running, clogging CPU.
  - B-tree: like a search tree with hundreds of pointers, instead of 2 like a
    binary tree. B+ tree is "extended" B tree.
  - `pg_relation_filepath`, shows where index is?
  - Hexdump, offset line number.
  - Table on disk is stored as "Pages" are a postgres-specific construction, 8kb pages. On-disk!
  - **Data on disk is row-oriented data in PG.** NOT in b-tree format. File
    broken up in 8kb chunks.
    - column oriented data would be better for analytical data. Wide rows.
      Wasteful if you stored as rows because you might only need like 2 columns.
  - Query planner does not plan based on what's in the cache!
  - Sequential scan just reads pg filedump rows one by one.
  - ### Buffer Cache
    - Cache where we keep around pages from various tables. Loads the most
      recently used cache. LRU cache.
    - I assume this is in-memory.
- "project" columns?
- Postgres TOAST table. Storing fields that are too big for 8kb page. Breaks up
  large values by compressing and breaking them up into multiple physical rows.
- "Autovacuum"?
- Executor and indexes next time
