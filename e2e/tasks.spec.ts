import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const TENANT_SLUG = process.env.TENANT_SLUG || 'jonlee';
const USER_EMAIL = process.env.USER_EMAIL || 'jaudu2@gmail.com';
const USER_PASSWORD = process.env.USER_PASSWORD || 'password001';

test.describe('Tasks Module - Detailed Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Log in
    await page.goto(`/${TENANT_SLUG}/auth/login`);
    await page.fill('input[type="email"]', USER_EMAIL);
    await page.fill('input[type="password"]', USER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(`**/${TENANT_SLUG}`);
  });

  test('should manage task details: messages, activities, and metadata', async ({ page }) => {
    // 1. Navigate to Projects
    await page.click('text=Projects');
    await page.waitForURL(`**/${TENANT_SLUG}/project`);

    // 2. Create a project for this test
    const projectName = `Task Test Project ${Date.now()}`;
    await page.click('text=New Project');
    await page.fill('input[placeholder="Enter project name..."]', projectName);
    await page.click('button:has-text("Create Project")');
    await page.waitForURL(new RegExp(`/${TENANT_SLUG}/project/[^/]+`));

    // 3. Create a new task
    await page.click('button:has-text("Sync New Task")');
    const taskTitle = `Task Detail Test ${Date.now()}`;
    await page.fill('input[placeholder="e.g., Finalize project documentation..."]', taskTitle);
    // Assign the current user to avoid "Secure Channel Locked"
    await page.click('button:has-text("Jonathan Audu")');
    await page.click('button:has-text("Create Project Task")');

    // 4. Wait for task and open it
    const taskCard = page.locator('div.cursor-grab', { hasText: taskTitle }).first();
    await expect(taskCard).toBeVisible();
    await taskCard.click({ force: true });

    // 5. Test Messaging
    await page.click('button:has-text("messages")');
    const messageContent = 'Hello from E2E test';
    await page.fill('textarea[placeholder="Type message..."]', messageContent);
    await page.click('button:has-text("send")');
    await expect(page.locator(`text=${messageContent}`)).toBeVisible();

    // 6. Test Metadata Updates (Priority & Due Date)
    await page.locator('label', { hasText: /^Priority$/i }).locator('..').locator('select').selectOption('URGENT');
    await page.locator('label', { hasText: /^Due Date$/i }).locator('..').locator('input[type="date"]').fill('2026-11-20');

    // 7. Test Scheduled Activities
    await page.click('button:has-text("scheduled")');
    await page.locator('label', { hasText: /^Activity Type$/i }).locator('..').locator('select').selectOption('MEETING');
    await page.locator('label', { hasText: /^Responsible Member$/i }).locator('..').locator('select').selectOption({ index: 1 });
    await page.locator('label', { hasText: /^Activity Date & Time$/i }).locator('..').locator('input[type="datetime-local"]').fill('2026-11-21T10:00');
    await page.fill('input[placeholder="Optional note..."]', 'Test meeting note');
    // Find the submit button in the scheduling form
    await page.click('button:has-text("Schedule Activity")');
    await expect(page.locator('text=Activity scheduled')).toBeVisible();

    // 8. Test Tags
    await page.fill('input[placeholder="Add tag"]', 'Automated');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500); // Wait for state update
    await expect(page.locator('text=Automated')).toBeVisible();

    // 9. Save all changes
    await page.click('button:has-text("Save Changes")');
    await expect(page.locator('text=Task updated')).toBeVisible();
    
    // Wait for the modal to fully close
    await expect(page.locator('text=Back to Board')).not.toBeVisible();

    // Force a reload to ensure the board is synced with the DB
    await page.reload();
    await page.waitForURL(`**/${TENANT_SLUG}/project/*`);

    // 10. Verify card reflects changes (Priority color/tag)
    const updatedTaskCard = page.locator('div.cursor-grab', { hasText: taskTitle }).first();
    await expect(updatedTaskCard.getByText('Automated')).toBeVisible();
  });
});
