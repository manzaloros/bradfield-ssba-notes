# Overview of distributed systems

- Nowadays microservices are prevalent and aren't a great trend
- If you keep things on a single machine, the operating solves a bunch of
  problems for you, but if you do it as a distributed systems, you have to solve
  those problems again yourself.
  - OS has a scheduler, different systems for prioritization
  - how do you allocate compute resources across lots of different tasks
  - On a single machine, a web server and a database server will communicate
    over the loopback interface via a socket!
    - if the DB server is on another machine, the communication between two
      servers is via a network call, and the two machines might not even be able
      to communicate
  - "single node system", the non-distributed system
- What do we do when there's a network partition?
- Federated micro-frontends

## Aside: Bluetooth

- Wifi backs off when there's a problem. Random backoff if there are collisions.
  No tracking of state. Everyone just backs off.
- Bluetooth, explicit access control via a token
- Explicitly sharing a medium
- Bluetooth access control is stateful.

## Partition Tolerance

- "partition": it means we CANNOT reach this machine.
- What do you do? What are the options?
  - serve stale data. Not ideal. Not consistent.
  - tell client to try again later. Not available! CAP theorem.
    - Choosing 2 of the three.
    - But you can't be highly consistent IF you want to be highly available.
- Objectives of distributed systems
  - Fault tolerance.
  - Throughput, number of reads / or requests you can do per second. Scaling.
  - Latency. Reducing latency.
  - What's a fault vs. what's a failure? If an entire geographic region goes
    down and takes your datacenters down, is that a fault or a failure? If it's
    a fault that means you need replication across regions!
- Reasons for faults
  - Software bugs
    - Memory leak
    - Resource misallocation.
    - Buffer overrun
    - Overflow
  - Physical issues
    - Power issues. Test those backup generators. Power loss to rack, switch,
      blade, etc.
    - ## go check out linkedin's data center somewhere! Get a tour!##
    - Blades slot-in to racks.
    - RAM chip fails. Bit flips are very hard to detect.
    - Disk failure. MTTF 10-50 years
- Motivating problem for `mapReduce` was to crawl whole web for to build
  Google's index.
- Scenarios that could cause a network partition
- Invalid YAML. Operator error?
- Physical issues: build **redundancy** or failover.
  - We want another copy of the data: Replication.
  - Replication also gives us fault tolerance.
  - RAID could be for one device redundancy.
  - More copies or instances of something.
- "chaos monkey"
  - Netflix
  - Randomly taking stuff down to see how to make the system more resilient.
    Role playing messing things up.
- We should have an answer if there's a fault. Redundancy is usually the answer.
- Bugs keep us in business.
- Software bugs harder to build fault tolerance for.
- Better UI design can prevent users from taking an action inadvertantly that
  causes a catastrophic failure.
- Distributed Systems ARE "complex systems"
  - hospitals,
  - nuclear reactor failures
- Instead of a single point of failure, a few things need to go wrong (faults) for there
  to be a failure.
- Every piece of the failure is an opportunity to improve the system
- Distributed systems engineers have job security
- Amazon's stream processing system, log-based, modeled off Kafka.
  - Kinesis.
  - A lot of events, you want to log and process them.
  - Write heavy throughput. Scaling writes.
- Code smell.

## Partitioning, another tool for fault tolerance and throughput

- Orthogonal concerns
  - Data can go to any machine, doesn't matter where it goes.
  - But that isn't what Kafka was built for, it just is an orthagonal concern.
- Dynamo, Spanner, large scale system.
  - Spanner
    - Google's large scale distributed data store.
- Sharding:
  - For write heavy throughput, NOT just read. Just read heavy would be easier
    to replicate.
  - A-K on this DB, L-Z on this DB. More writes now for the system.
  - Manually finding a cutoff point. Re-sharding after a while. But you can use
    an automated partitioning scheme. You don't have to think about how it's
    partitioned.
  - shard and partitioning can be used interchangeably.

## How do you improve latency?

- CDNs
  - this is replication
- network operates at half the speed of light.
  - if you have a speed of light distance between 2 cities of 100ms, network
    packet should get there in 200ms.
- Partitioning could help as well, where each data center does a certain thing.
  This is kind of rare.

## Costs

- High complexity
- Reduced consistency
  - increasing availability (fault tolerance) reduces consistency
- Read replicas
  - replication lag.
  - Synchronous replication is bad for fault tolerance — what if one of the read
    replicas is down???
  - Better to do asynchronous replication
    - Write to primary, do your best to update all the Read replicas
- Race conditions?
- Microservices are bad because you're taking on the problems with distributed
  systems but none of the benefits like high complexity or reduced consistency.

## What's better? Automated, or manual failover?

- Automated could be good, but it makes it complicated to decide when the system
  is truly down.
- Have a heartbeat. Or an external probe.
- If you have a hot standby, it NEEDS to be ready to go. Hot cache.
- Downtime is one thing, but data integrity is a MUCH bigger deal.
- Some things are incoherent.
- Fault tolerance needs to be tested!
- Don't use auto-incrementing integer ideas. It's a big problem on distributed
  systems. Just use UUID! What are you, saving bits? 😅
- "one good o'reilly book" DDIA
- Ask Oz about potential projects or class notes if you're interested in a
  potential project
- Mundane, day to day things will be helped by understanding Computer Science
- CS Primer
- Dave Beasly has good courses online.
- Distributed data bases are HIGHLY valued by the industry, right now.
