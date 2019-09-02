import PropTypes from 'prop-types';

export const EventPropType = PropTypes.shape({
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired
});

export const RacePropType = PropTypes.shape({
  current: PropTypes.bool,
  description: PropTypes.string.isRequired,
  legend: PropTypes.string.isRequired,
  event: PropTypes.string.isRequired
});

export const ContactPropType = PropTypes.shape({
  href: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
});

export const MarkerPropType = PropTypes.shape({
  location: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired
  }).isRequired,
  label: PropTypes.string.isRequired
});

export const SchedulePointPropType = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired
});

export const InfoPropType = PropTypes.shape({
  contacts: PropTypes.shape({
    email: ContactPropType.isRequired,
    facebook: ContactPropType,
    larpCz: ContactPropType,
    larpovadatabaze: ContactPropType
  }),
  poi: PropTypes.arrayOf(MarkerPropType),
  date: PropTypes.objectisRequired,
  price: PropTypes.string.isRequired,
  registrationOpen: PropTypes.bool.isRequired,
  schedule: PropTypes.arrayOf(SchedulePointPropType)
});

export const LegendPropType = PropTypes.shape({
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  current: PropTypes.bool,
  event: PropTypes.string.isRequired,
  date: PropTypes.object
});

export const ParticipantsPropType = PropTypes.shape({
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  nickname: PropTypes.string,
  group: PropTypes.string,
  race: PropTypes.string.isRequired,
  raceRef: PropTypes.object.isRequired
});

export const RulesPropType = PropTypes.shape({
  priority: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
  event: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
});
