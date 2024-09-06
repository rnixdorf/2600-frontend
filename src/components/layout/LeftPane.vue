<template>
    <div class="flex-pane">
      <h2>
        Files
        <KButton @click="getFiles">
          <span class="k-icon k-i-refresh"></span>
        </KButton>
      </h2>
      <div>
        Apple Send Mode:
        <k-switch :value="appleSendMode" @change="toggleAppleSendMode" />
      </div>
      <CurrentViewDropdown />
      <div class="form-grid">
        <div class="fieldName">Sort Order:</div>
        <div class="field-input">
          <kendo-dropdown
            class="input"
            :data-items="allSortTypes"
            textField="display"
            :dataItemKey="'display'"
            v-model.number="currentSort"
          />
        </div>
      </div>
  
      <!-- Filter Accordian -->
      <div class="accordian" v-if="!appleSendMode">
        <div @click="showFilters = !showFilters" class="accordian-header">
          Filters
          <span
            style="float: right; padding: 0px 10px"
            class="k-icon"
            :class="{
              'k-i-arrow-chevron-down': !showFilters,
              'k-i-arrow-chevron-up': showFilters,
            }"
          />
        </div>
        <div v-show="showFilters" class="accordian-body">
          <DynamicForm v-model="filters"></DynamicForm>
          <div class="button-container">
            <KButton @click="clearFilters">
              <span class="k-icon k-i-filter-clear"></span>
              Clear Filters
            </KButton>
            <KButton @click="applyFilters(filters)">
              <span class="k-icon k-i-filter"></span>
              Apply Filters
            </KButton>
          </div>
          <div class="button-container">
            <KButton @click="multiselectAllFiles">
              <i class="bi bi-check2-all"></i>
              Select All Filtered Items
            </KButton>
          </div>
        </div>
      </div>
  
      <div style="width: 100%">
        <k-input
          v-if="fuzzyData.length > 0"
          id="kiki-item-search"
          type="search"
          class="k-textbox"
          style="margin: 10px 0 10px 0; width: calc(100% - 20px)"
          placeholder="Search items..."
          v-model="fuzzySearch"
        />
      </div>
      <span class="k-icon k-i-loading" v-if="loading"></span>
      <div id="kiki-items-listbox" class="listbox" v-if="fuzzyData.length > 0">
        <FileListItem
          v-for="file in files.slice(currentPage.min, currentPage.max)"
          :key="file.uuid"
          :file="file"
        >
        </FileListItem>
        <div v-if="files.length === 0" class="empty-list">
          <i class="bi bi-exclamation-circle"></i>
          No matching items found.
        </div>
  
        <!-- handles listbox pagination -->
        <PaginationButtons
          class="listbox-footer"
          :listSize="files.length"
          :windowSize="50"
          v-model="currentPage"
        />
      </div>
      <div v-if="recentUploads.length > 0" style="width: 100%">
        <h2>Recently Uploaded</h2>
        <div class="listbox">
          <div
            class="listbox-item"
            v-for="(upload, index) in recentUploads"
            :key="`${upload}-${index}`"
          >
            {{ upload }}
          </div>
        </div>
      </div>
    </div>
  </template>