Let's define our priorities first:

1. We will work on an agile manner, first try to provide value to the user as fast as possible
2. Integrations are the most valuable thing for the user, so having the system integrated with OCA is top prio
3. Once a week we will provide demos/videos to the client for fast feedback and quick small changes
4. Tasks should be small enough to work on an iterative manner
5. Each iteration will be a week

First iteration will be

1. Create a package in the system. A package order has a tracking number and a QR Code with its id.
2. Create a PDF from the created package order
3. Given a package id, create an OCA order with that info. Save it into the DB
4. Create a landing page to: track a package, create a package order and login into the system
5. Given a package id, search and see its information and status in the system without login

Second iteration

1. Create a login page and hardcoded users with roles ADMIN, TRANSPORTIST, EMPLOYEE
2. Manage cookies, sessions, etc.
3. Create a homepage to visualize and manage the package orders
4. Create a page to visualize the received packages that are awaiting to be delivered
5. Create a page to visualize the "in transit" packages that are in hands of transportists
6. Create a page to visualize the historic packages that have been processed
7. Create a page to visualize statistics and metrics in a dashboard

Third iteration

1. Create a way to read QR codes from the camera on both mac and smartphones
2. Given a package id that is being distributed by OCA, show the OCA tracking url
3. Given a employee that is in Orders, allow them to Scan the QR Code of an order to accept it in a modal
4. Given an employee has scanned an order, allow them to edit it
5. Once an order has been accepted, an employee should be able to quickly print the order
6. Given a package, assign it to a Transportist
7. Manage the access per roles
    1. ADMIN has access to everything
    2. TRANSPORTIST only has access to In Transit packages
    3. EMPLOYEE has access to Orders, Packages, Tracking and Delivered views
8. Add payment field status as an enum: Unpaid, Paid, PayOnDestiny

Post-mvp

1. Create a page to visualize statistics and metrics in a dashboard
2. Export In transit packages to a pdf so that the transportist can print it and use during the delivering

Out of scope:

1. Mail notifications for when an Order has been created, or a package delivered
