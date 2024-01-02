import { createApplication } from '@nbit/bun';

const { defineRoutes } = createApplication();

export default defineRoutes((app: any) => [
  app.get('/dash/home/personal', async (request: any) => {
    return {
        name: 'Jake Walklate', 
        gender: 'M',
        dob: '26-06-1997',
        bloodType: 'O+',
        height: '155cm',
        weight: '58kg'
    };
  }),
]);