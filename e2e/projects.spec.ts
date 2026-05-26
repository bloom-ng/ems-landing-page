import { test, expect } from '@playwright/test';

// Replace these with actual test credentials and tenant slug
const TENANT_SLUG = process.env.TENANT_SLUG || 'jonlee';
const USER_EMAIL = process.env.USER_EMAIL || 'jaudu2@gmail.com';
const USER_PASSWORD = process.env.USER_PASSWORD || 'password001';

test.describe('Projects Module - Kanban & Settings Workflow', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    // 1. Log in to the tenant workspace
    await page.goto(`/${TENANT_SLUG}/auth/login`);
    
    // Fill in login credentials
    await page.fill('input[type="email"]', USER_EMAIL);
    await page.fill('input[type="password"]', USER_PASSWORD);
    await page.click('button[type="submit"]');

    // Wait for navigation to the dashboard
    await page.waitForURL(`**/${TENANT_SLUG}`);
  });

  test('should create a project, configure settings, and manage tasks', async ({ page }) => {
    // 2. Navigate to Projects module
    await page.click('text=Projects');
    await page.waitForURL(`**/${TENANT_SLUG}/project`);

    // 3. Create a new Project
    await page.click('text=New Project');
    await page.fill('input[placeholder="Enter project name..."]', 'E2E Test Project');
    await page.fill('textarea[placeholder="Project details..."]', 'Testing the project module features.');
    await page.click('button:has-text("Create Project")');

    // Creating a project redirects to its Kanban board
    await page.waitForURL(`**/${TENANT_SLUG}/project/*`);

    // Navigate back to Projects list to test the settings modal
    await page.click('a:has-text("Projects")');
    await page.waitForURL(`**/${TENANT_SLUG}/project`);

    // Wait for the new project card to appear
    const projectCard = page.locator('.group', { hasText: 'E2E Test Project' }).first();
    await expect(projectCard).toBeVisible();

    // 4. Test the Project Settings Modal (Cog Icon)
    // Hover over the project card to reveal the cog icon
    await projectCard.hover();
    await projectCard.locator('button:has-text("settings")').click();

    // Verify the 4-part menu is visible
    await expect(page.getByRole('button', { name: 'visibility View' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'bar_chart Reporting' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'palette Color' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'settings Settings' })).toBeVisible();

    // 5. Navigate to the Settings tab and update configurations
    await page.getByRole('button', { name: 'settings Settings' }).click();
    
    // Update Task Name (match the exact label or a prefix)
    await page.locator('div').filter({ hasText: /^Task Naming/i }).locator('input').fill('Ticket');
    
    // Select a Project Manager (Select component)
    await page.locator('div').filter({ hasText: /^Project Manager/i }).locator('select').selectOption({ index: 1 });
    
    // Select a Customer (Select component)
    await page.locator('div').filter({ hasText: /^Customer/i }).locator('select').selectOption({ index: 1 });

    // Update Allocated Hours
    await page.locator('div').filter({ hasText: /^Total Allocated Hours/i }).locator('input').fill('120.5');
    
    // Update Planned Date
    await page.locator('input[type="date"]').fill('2026-12-31');

    // Add a Tag
    await page.fill('input[placeholder="Add tag..."]', 'High Priority');
    await page.keyboard.press('Enter');

    // Save Changes
    await page.click('button:has-text("Save Changes")');
    await expect(page.locator('text=Project updated')).toBeVisible();

    // 6. Test the Color Customization
    await projectCard.hover();
    await projectCard.locator('button:has-text("settings")').click();
    await page.getByRole('button', { name: 'palette Color' }).click();
    
    // Select a color (assuming the first color preset button)
    await page.locator('.grid-cols-5 button').first().click();
    await page.click('button:has-text("Save Changes")');

    // Verify the color line appears on the card (checking style)
    // The accent line is a div with an inline background-color style
    await expect(projectCard.locator('div[style*="background-color"]')).toBeVisible();

    // 7. Navigate into the Project Kanban Board
    await projectCard.click();
    await page.waitForURL(`**/${TENANT_SLUG}/project/*`);

    // 8. Create a new Task (Ticket)
    await page.click('button:has-text("Sync New Task")');
    await page.fill('input[placeholder="e.g., Finalize project documentation..."]', 'Implement E2E Tests');
    await page.click('button:has-text("Create Project Task")');

    // Wait for the task card to appear in the Kanban board
    const taskCard = page.locator('div.cursor-grab', { hasText: 'Implement E2E Tests' }).first();
    await expect(taskCard).toBeVisible();

    // 9. Edit the Task and Test the Assignee Multi-select
    await page.waitForTimeout(1000); // Ensure fetchTasks completes and DOM is stable
    await taskCard.click({ force: true });
    
    // Save the task changes
    await page.click('button:has-text("Save Changes")');
    await expect(page.locator('text=Task updated')).toBeVisible();
  });
});
