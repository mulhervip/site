const fse = require('fs-extra');
const parser = require('fast-xml-parser');
const XMLParser = require('fast-xml-parser').j2xParser;
const path = require('path');
const readdirp = require('readdirp');

/** XML parser options shared between read/write */
const XML_PARSER_OPTIONS = {
    ignoreAttributes: false,
    parseAttributeValue: true,
    attributeNamePrefix: '_',
    textNodeName: 'text',
    cdataTagName: '@cdata',
    format: true,
    indentBy: '  ',
    suppressEmptyNode: true
};

/**
 * Write the JSON data into the specified output file path
 *
 * @param {Path} outputPath the path of the merged XML report
 * @param {Object} mergedReportAsJSON the merge result as JSON structure
 * @returns {Promise} with the merged report path
 */
const writeMergedReport = (outputPath, mergedReportAsJSON) => {
    const xmlParser = new XMLParser(XML_PARSER_OPTIONS);
    const xml = xmlParser.parse(mergedReportAsJSON);
    const content = `<?xml version="1.0" encoding="utf-8"?>\n${xml}`;
    return new Promise((resolve, reject) => {
        const parentPath = path.dirname(outputPath);
        if (!fse.existsSync(parentPath)) {
            try {
                fse.mkdirSync(parentPath, { recursive: true });
            } catch (err) {
                reject(err);
            }
        }
        fse.writeFile(outputPath, content, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(outputPath);
            }
        });
    });
};

/**
 * Load the XML report as a JSON structure
 *
 * @param {Path} reportPath the XML report to load
 * @returns {Promise} with XML data converted as a JSON structure
 */
const loadReport = (reportPath) => {
    return new Promise((resolve, reject) => {
        fse.readFile(reportPath, { encoding: 'utf8' }, (err, xml) => {
            if (err) {
                reject(err);
            } else {
                const json = parser.parse(xml, XML_PARSER_OPTIONS);
                resolve(json);
            }
        });
    });
};

/**
 * Creates a JSON structure, merge result of all JSON reports
 *
 * @param {Object} reportsAsJSON
 * @returns {Object} the merge result of all reports as a JSON structure
 */
const createReportAsJSON = (reportsAsJSON) => {
    const mergedReportAsJSON = {
        testExecutions: {
            _version: 1,
            file: []
        }
    };
    for (const reportAsJSON of reportsAsJSON) {
        mergedReportAsJSON.testExecutions.file.push(reportAsJSON.testExecutions.file);
    }

    return mergedReportAsJSON;
}

/**
 * Merge all SonarQube XML reports into a single XML report.
 *
 * @param {Path} outputPath the path of the merged XML report
 * @param {Path[]} reportPaths the list of reports path to merge
 * @returns {Promise} the merged report path
 */
const mergeReportFiles = (outputPath, reportPaths) => {
    return new Promise((resolve, reject) => {
        if (reportPaths.length > 0) {
            const proms = [];
            for (const reportPath of reportPaths) {
                proms.push(loadReport(reportPath));
            }
            Promise.all(proms).then((reportsAsJSON) => {
                const mergedReportAsJSON = createReportAsJSON(reportsAsJSON);
                writeMergedReport(outputPath, mergedReportAsJSON)
                    .then(resolve)
                    .catch(reject);
            }).catch(reject);
        } else {
            resolve('no reports found');
        }
    });
};


/**
 * Merge all SonarQube XML reports into a single XML report.
 *
 * @see https://docs.cypress.io/api/plugins/after-run-api
 * @see https://docs.cypress.io/guides/guides/module-api#Results
 * @param {Object} results the Cypress run results
 * @param {Object} options the merge options
 * @returns {Promise} with the merged report path
 */

const mergeReports = () => {
  const reportsOutputDir = './reports'
  const mergeOutputDir = './reports'
  const mergeFileName = 'cypress-sonarqube-reports.all.xml'
  const reportsOutputPath = path.resolve(reportsOutputDir);
  const mergeOutputPath = path.resolve(mergeOutputDir);
  const mergeFilePath = path.resolve(mergeOutputPath, mergeFileName);
  return new Promise((resolve, reject) => {
      if (fse.existsSync(mergeFilePath)) {
          fse.unlinkSync(mergeFilePath);
      }
      readdirp.promise(reportsOutputPath, {
          fileFilter: ['!*.all.xml', '*.xml'],
          type: 'files',
          depth: 100
      }).then((reports) => {
          mergeReportFiles(mergeFilePath, reports.map((file) => file.fullPath))
              .then(resolve)
              .catch(reject);
      }).catch(reject);
  });
};

mergeReports()
