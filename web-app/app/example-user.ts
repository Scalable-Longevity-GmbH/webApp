// app/example-user.ts

export type Gender = 'male' | 'female' | 'non-binary' | 'other';

export interface User {
    name: string;
    image: string; // URL or local path
    biologicalAge: number;
    chronologicalAge: number;
    bmi: number;
    gender: Gender;
}

export const exampleUsers: User[] = [
    {
        name: 'Ava Martinez',
        image: '/ava-martinez.jpg',
        biologicalAge: 29,
        chronologicalAge: 35,
        bmi: 22.5,
        gender: 'female',
    },
    {
        name: 'Marcus Lee',
        image: '/marcus-lee.jpg',
        biologicalAge: 36,
        chronologicalAge: 40,
        bmi: 27.8,
        gender: 'male',
    },
    {
        name: 'Jordan Patel',
        image: '/jordan-patel.jpg',
        biologicalAge: 31,
        chronologicalAge: 31,
        bmi: 24.1,
        gender: 'non-binary',
    },
];

export default exampleUsers;