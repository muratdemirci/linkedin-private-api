import Chance from 'chance';
import { times } from 'lodash';

import { createMiniProfile } from '../profile/profile-factories';

const chance = new Chance();
const createSearchHit = (count: number) =>
  times(count, () => ({
    $type: 'com.linkedin.voyager.search.SearchHitV2',
    publicIdentifier: chance.guid(),
    targetUrn: chance.guid(),
    trackingId: chance.guid(),
    trackingUrn: chance.guid(),
  }));

const createSearchCluster = (count: number, searchHitCount: number) =>
  times(count, () => ({
    $type: 'com.linkedin.voyager.search.BlendedSearchCluster',
    elements: createSearchHit(searchHitCount),
    type: 'SEARCH_HITS',
  }));

const createMiniCompany = (count: number) =>
  times(count, () => ({
    $type: 'com.linkedin.voyager.entities.shared.MiniCompany',
    active: chance.bool(),
    entityUrn: `urn:li:fs_miniCompany:${chance.guid()}`,
    name: chance.guid(),
    objectUrn: chance.guid(),
    showcase: chance.bool(),
    trackingId: chance.guid(),
    universalName: chance.word(),
  }));

const createBaseCompany = (count: number) =>
  times(count, () => ({
    $type: 'com.linkedin.voyager.organization.Company',
    entityUrn: chance.guid(),
    logo: {
      $type: 'com.linkedin.voyager.organization.CompanyLogoImage',
      image: {},
      type: 'SQUARE_LOGO',
    },
    name: chance.guid(),
  }));

const createJobPosting = (count: number) =>
  times(count, () => ({
    $type: 'com.linkedin.voyager.jobs.JobPosting',
    entityUrn: chance.guid(),
    dashEntityUrn: chance.guid(),
    formattedLocation: chance.string(),
    listedAt: chance.integer(),
    title: chance.string(),
    workRemoteAllowed: chance.bool(),
    companyDetails: {
      '*companyResolutionResult': chance.string(),
      $type: 'com.linkedin.voyager.jobs.JobPostingCompany',
      company: chance.string(),
    },
  }));

const createJobSearchHit = (count: number) =>
  times(count, () => ({
    $type: 'com.linkedin.voyager.search.SearchHit',
    hitInfo: {
      '*jobPostingResolutionResult': chance.string(),
      $type: 'com.linkedin.voyager.search.SearchJobJserp',
      jobPosting: chance.string(),
      sponsored: chance.bool(),
    },
    targetPageInstance: chance.string(),
    trackingId: chance.string(),
  }));

export const creatSearchPeopleResponse = (count: number) => ({
  data: {
    elements: createSearchCluster(count, 1),
  },
  included: createMiniProfile(count),
});

export const createSearchCompaniesResponse = (count: number) => ({
  data: {
    elements: createSearchCluster(count, 1),
  },
  included: createMiniCompany(count),
});

export const createSearchJobsResponse = (count: number) => {
  const companies = createBaseCompany(count);
  const jobPostings = createJobPosting(count).map((jp, index) => ({
    ...jp,
    companyDetails: {
      ...jp.companyDetails,
      company: companies[index].entityUrn,
    },
  }));
  const searchHits = createJobSearchHit(count).map((sh, index) => ({
    ...sh,
    hitInfo: {
      ...sh.hitInfo,
      jobPosting: jobPostings[index].entityUrn,
    },
  }));

  return {
    data: {
      elements: searchHits,
    },
    included: [...jobPostings, ...companies],
  };
};
