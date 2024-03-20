
// auth
export { default as login } from './auth/login';
export { default as register } from './auth/register';
export { default as reset } from './auth/reset';

// dash/home
export { default as map } from './dash/home/map';
export { default as personalInfo } from './dash/home/personal';
export { default as table } from './dash/home/table';

// dash settings
export { default as personalSettings } from './dash/settings/personal';
export { default as password } from './dash/settings/password';
export { default as phoneNumber } from './dash/settings/phone-number';
export { default as email } from './dash/settings/email';

// dash settings clinic
export { default as createClinic } from './dash/settings/clinic/create';
export { default as readClinic } from './dash/settings/clinic/clinic';
export { default as deleteClinic } from './dash/settings/clinic/delete';
export { default as editClinic } from './dash/settings/clinic/edit';
export { default as leaveClinic } from './dash/settings/clinic/leave';

// dash settings appointment
export { default as appointmentBooking } from './dash/appointment/booking';

// dash settings physician
export { default as physician } from './dash/settings/physician/physician';
export { default as joinClinicPhysician } from './dash/settings/physician/join';
export { default as leaveClinicPhysician } from './dash/settings/physician/leave';
export { default as editClinicPhysician } from './dash/settings/physician/edit';