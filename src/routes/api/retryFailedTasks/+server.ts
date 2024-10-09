import { retryFailedTasks } from '$lib/tasks/retryFailedTasks';

export async function POST() {
    try {
        await retryFailedTasks(); // Retry failed tasks
        return new Response('Failed tasks retried successfully', { status: 200 });
    } catch (error) {
        console.error('Error retrying failed tasks:', error);
        return new Response('Failed to retry tasks', { status: 500 });
    }
}
