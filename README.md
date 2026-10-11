# Vehicle Path Analyzer

A Node.js application that analyses vehicle GPS data to calculate journey statistics and measure distances between a recorded vehicle route and nearby store locations.

## Overview

Vehicle Path Analyzer was developed as a technical assessment project to explore backend programming, data processing, and geographical calculations.

The application processes recorded vehicle GPS data alongside store location information to generate useful journey statistics. It demonstrates how raw tracking data can be transformed into meaningful information through software.

## Features

- **Closest Store Analysis:** Identifies the store closest to the recorded vehicle route.
- **Furthest Store Analysis:** Identifies the store whose nearest recorded route point is farthest away.
- **Distance Calculation:** Estimates the total distance travelled using consecutive GPS coordinates.
- **Maximum Speed Analysis:** Determines the highest recorded vehicle speed.
- **Data Processing:** Reads vehicle tracking records from JSON and store information from CSV files.
- **Input Validation:** Includes validation for required store data and coordinate values.

## Technologies Used

- Node.js
- JavaScript
- CSV Parser
- JSON data processing
- Jest testing framework

## Project Structure

```text
vehicle-path-analyzer/
├── data/
│   ├── PathTravelled.json
│   └── storesCopy.csv
├── src/
│   └── index.js
├── test/
├── package.json
├── package-lock.json
└── Approach explanation.docx
```

## How It Works

The application loads recorded vehicle GPS data from a JSON file and store locations from a CSV file.

It uses the Haversine formula to calculate geographical distances between latitude and longitude coordinates.

The application then compares store locations against the recorded vehicle route to determine proximity and calculate journey statistics.

The resulting information is displayed in the terminal.

## Getting Started

### Prerequisites

Install [Node.js](https://nodejs.org/) and npm before running the application.

### Installation

Clone the repository:

```bash
git clone https://github.com/LawrenceKgau/vehicle-path-analyzer.git
```

Navigate to the project directory:

```bash
cd vehicle-path-analyzer
```

Install the project dependencies:

```bash
npm install
```

### Running the Application

Start the application using:

```bash
npm start
```

The application processes the available input files and displays its calculated results.

### Running Tests

The project is configured to use Jest. Run the following command to execute the test suite:

```bash
npm test
```

## Technical Concepts Demonstrated

This project explores several practical software development concepts:

- Backend application development with Node.js.
- Processing structured JSON and CSV data.
- Working with GPS coordinates and geographical distances.
- Applying the Haversine formula.
- Analysing vehicle journey data.
- Validating input data.
- Organising application logic into maintainable code.

## Limitations

The accuracy of the results depends on the quality and completeness of the supplied GPS records and store coordinates.

The calculated journey distance is an estimate based on consecutive recorded GPS points. It may differ from the actual distance travelled.

The application analyses recorded data and does not provide live vehicle tracking or a graphical mapping interface.

## License

Check the repository's license information before redistributing or reusing the code.
