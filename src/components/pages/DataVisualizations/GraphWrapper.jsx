import React from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import CitizenshipMapAll from './Graphs/CitizenshipMapAll';
import CitizenshipMapSingleOffice from './Graphs/CitizenshipMapSingleOffice';
import TimeSeriesAll from './Graphs/TimeSeriesAll';
import OfficeHeatMap from './Graphs/OfficeHeatMap';
import TimeSeriesSingleOffice from './Graphs/TimeSeriesSingleOffice';
import YearLimitsSelect from './YearLimitsSelect';
import ViewSelect from './ViewSelect';
import axios from 'axios';
import { resetVisualizationQuery } from '../../../state/actionCreators';
//import test_data from '../../../data/test_data.json';
import { colors } from '../../../styles/data_vis_colors';
import ScrollToTopOnMount from '../../../utils/scrollToTopOnMount';

const { background_color } = colors;

function GraphWrapper(props) {
  const { set_view, dispatch } = props;
  let { office, view } = useParams();
  if (!view) {
    set_view('time-series');
    view = 'time-series';
  }
  let map_to_render;
  if (!office) {
    switch (view) {
      case 'time-series':
        map_to_render = <TimeSeriesAll />;
        break;
      case 'office-heat-map':
        map_to_render = <OfficeHeatMap />;
        break;
      case 'citizenship':
        map_to_render = <CitizenshipMapAll />;
        break;
      default:
        break;
    }
  } else {
    switch (view) {
      case 'time-series':
        map_to_render = <TimeSeriesSingleOffice office={office} />;
        break;
      case 'citizenship':
        map_to_render = <CitizenshipMapSingleOffice office={office} />;
        break;
      default:
        break;
    }
  }
  function updateStateWithNewData(years, view, office, stateSettingCallback) {
    /*
          _                                                                             _
        |                                                                                 |
        |   Example request for once the `/summary` endpoint is up and running:           |
        |                                                                                 |
        |     `${url}/summary?to=2022&from=2015&office=ZLA`                               |
        |                                                                                 |
        |     so in axios we will say:                                                    |
        |                                                                                 |     
        |       axios.get(`${url}/summary`, {                                             |
        |         params: {                                                               |
        |           from: <year_start>,                                                   |
        |           to: <year_end>,                                                       |
        |           office: <office>,       [ <-- this one is optional! when    ]         |
        |         },                        [ querying by `all offices` there's ]         |
        |       })                          [ no `office` param in the query    ]         |
        |                                                                                 |
          _                                                                             _
                                   -- Mack 
    
    */
  const fiscalSummaryUrl = `${process.env.REACT_APP_API_URI}/fiscalSummary`;
  const citizenshipSummaryUrl = `${process.env.REACT_APP_API_URI}/citizenshipSummary`;
   const params ={
    from: years[0],
      to: years[1],
      };
 if (office && office !== 'all') {
  params.office = office;
}
axios.all([
  axios.get(fiscalSummaryUrl, { params }), // Fetch fiscal summary data
  axios.get(citizenshipSummaryUrl, { params }) // Fetch citizenship summary data
])
.then(axios.spread((fiscalResponse, citizenshipResponse) => {
  const fiscalData = fiscalResponse.data;
  const citizenshipData = citizenshipResponse.data;

  // Convert yearResults to array if it exists
  if (fiscalData && fiscalData.yearResults) {
    fiscalData.yearResults = Object.values(fiscalData.yearResults);
  }
  stateSettingCallback(view, office, [fiscalData, citizenshipData]);
}))
.catch(err => {
  console.error('Error fetching data:', err);
});
}
  const clearQuery = (view, office) => {
    dispatch(resetVisualizationQuery(view, office));
  };
  return (
    <div
      className="map-wrapper-container"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        minHeight: '50px',
        backgroundColor: background_color,
      }}
    >
      <ScrollToTopOnMount />
      {map_to_render}
      <div
        className="user-input-sidebar-container"
        style={{
          width: '300px',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <ViewSelect set_view={set_view} />
        <YearLimitsSelect
          view={view}
          office={office}
          clearQuery={clearQuery}
          updateStateWithNewData={updateStateWithNewData}
        />
      </div>
    </div>
  );
}

// function moldData(fiscalData, citizenshipData) {
//   // Modify this function according to how the data from both endpoints needs to be combined
//   return {
//     fiscalSummary: transformFiscalYearData(fiscalData),
//     citizenshipSummary: transformCitizenshipData(citizenshipData),
//   };
// }
// function transformFiscalYearData(apiData) {
//   if (!apiData || !apiData.yearResults) {
//     console.error("Fiscal year data is missing 'yearResults'");
//     return [];
//   }
//   return apiData.yearResults.map(year => ({
//     fiscal_year: year.fiscal_year,
//     granted: year.granted,
//     totalGranted: year.totalGranted,
//     denied: year.denied,
//     adminClosed: year.adminClosed,
//     totalCases: year.totalCases,
//     yearData: year.yearData.map(office => ({
//       office: office.office,
//       granted: office.granted,
//       totalGranted: office.totalGranted,
//       denied: office.denied,
//       adminClosed: office.adminClosed,
//       totalCases: office.totalCases
//     }))
//   }));
// }
// function transformCitizenshipData(apiData) {
//   return apiData.map(country => ({
//     citizenship: country.citizenship,
//     granted: country.granted,
//     totalGranted: country.totalGranted,
//     denied: country.denied,
//     adminClosed: country.adminClosed,
//     totalCases: country.totalCases
//   }));
// }

export default connect()(GraphWrapper);
